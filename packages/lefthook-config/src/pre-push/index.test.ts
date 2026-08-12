import { readFileSync } from "node:fs";
import { describe, expect, test, vi } from "vitest";
import type { PrePushDependencies } from ".";
import { isPrePushInputValid } from ".";

const zeroOid = "0".repeat(40);
const localOid = "1".repeat(40);
const remoteOid = "2".repeat(40);
const outgoingOid = "3".repeat(40);

function createDependencies() {
  return {
    isCommit: vi.fn<PrePushDependencies["isCommit"]>(() => true),
    lint: vi.fn<PrePushDependencies["lint"]>(() => true),
    listCommits: vi.fn<PrePushDependencies["listCommits"]>(() => []),
    readMessage: vi.fn<PrePushDependencies["readMessage"]>(() => "chore: add validation"),
  };
}

// pre-push の stdin を解析し、今回 push する commit だけを lint する。
describe("isPrePushInputValid", () => {
  // 新規 ref では remote 上に既にある履歴を除外する。
  test("rejects an invalid commit on a new ref", () => {
    const dependencies = createDependencies();
    dependencies.listCommits.mockReturnValue([outgoingOid]);
    dependencies.readMessage.mockReturnValue("chore: 日本語");
    dependencies.lint.mockReturnValue(false);

    const isValid = isPrePushInputValid(
      `refs/heads/topic ${localOid} refs/heads/topic ${zeroOid}\n`,
      "origin",
      dependencies,
    );

    expect(isValid).toBe(false);
    expect(dependencies.listCommits).toHaveBeenCalledWith(localOid, undefined, "origin");
    expect(dependencies.lint).toHaveBeenCalledWith("chore: 日本語");
  });

  // 既存 ref では remote oid より後ろの commit だけを検査する。
  test("allows valid commits on an existing ref", () => {
    const dependencies = createDependencies();
    dependencies.listCommits.mockReturnValue([outgoingOid]);

    const isValid = isPrePushInputValid(
      `refs/heads/topic ${localOid} refs/heads/topic ${remoteOid}\n`,
      "origin",
      dependencies,
    );

    expect(isValid).toBe(true);
    expect(dependencies.listCommits).toHaveBeenCalledWith(localOid, remoteOid, "origin");
    expect(dependencies.lint).toHaveBeenCalledWith("chore: add validation");
  });

  // remote oid がローカルにない場合は remote tracking refs を基準にする。
  test("falls back to remote refs when the remote oid is unavailable", () => {
    const dependencies = createDependencies();
    dependencies.isCommit.mockImplementation((oid) => oid !== remoteOid);

    const isValid = isPrePushInputValid(
      `refs/heads/topic ${localOid} refs/heads/topic ${remoteOid}\n`,
      "origin",
      dependencies,
    );

    expect(isValid).toBe(true);
    expect(dependencies.listCommits).toHaveBeenCalledWith(localOid, undefined, "origin");
  });

  // ref 削除では commit message の検査対象がない。
  test("skips ref deletions", () => {
    const dependencies = createDependencies();

    const isValid = isPrePushInputValid(
      `refs/heads/topic ${zeroOid} refs/heads/topic ${remoteOid}\n`,
      "origin",
      dependencies,
    );

    expect(isValid).toBe(true);
    expect(dependencies.isCommit).not.toHaveBeenCalled();
    expect(dependencies.lint).not.toHaveBeenCalled();
  });

  // 同じ commit を複数 ref で push しても一度だけ検査する。
  test("deduplicates commits across ref updates", () => {
    const dependencies = createDependencies();
    dependencies.listCommits.mockReturnValue([outgoingOid]);
    const input = [
      `refs/heads/topic ${localOid} refs/heads/topic ${zeroOid}`,
      `refs/tags/topic ${localOid} refs/tags/topic ${zeroOid}`,
    ].join("\n");

    const isValid = isPrePushInputValid(`${input}\n`, "origin", dependencies);

    expect(isValid).toBe(true);
    expect(dependencies.lint).toHaveBeenCalledTimes(1);
  });

  // commit を指さない ref は検査対象外にする。
  test("skips refs that do not resolve to commits", () => {
    const dependencies = createDependencies();
    dependencies.isCommit.mockReturnValue(false);

    const isValid = isPrePushInputValid(
      `refs/tags/blob ${localOid} refs/tags/blob ${zeroOid}\n`,
      "origin",
      dependencies,
    );

    expect(isValid).toBe(true);
    expect(dependencies.listCommits).not.toHaveBeenCalled();
    expect(dependencies.lint).not.toHaveBeenCalled();
  });

  // remote 上の既存履歴だけなら検査対象を空にする。
  test("does not relint commits that are already on the remote", () => {
    const dependencies = createDependencies();
    dependencies.listCommits.mockReturnValue([]);

    const isValid = isPrePushInputValid(
      `refs/heads/topic ${localOid} refs/heads/topic ${zeroOid}\n`,
      "origin",
      dependencies,
    );

    expect(isValid).toBe(true);
    expect(dependencies.lint).not.toHaveBeenCalled();
  });
});

// recommended preset が stdin 対応の pre-push fragment を必ず読み込む。
test("wires commitlint into the recommended pre-push hook", () => {
  const recommended = readFileSync(new URL("../../recommended.yaml", import.meta.url), "utf-8");
  const fragment = readFileSync(
    new URL("../../hooks/pre-push/commitlint.yaml", import.meta.url),
    "utf-8",
  );

  expect(recommended).toContain(
    "node_modules/@nozomiishii/lefthook-config/hooks/pre-push/commitlint.yaml",
  );
  expect(recommended).toMatch(/pre-push:\n\s+parallel: true/);
  expect(fragment).toContain("use_stdin: true");
  expect(fragment).toContain('node node_modules/@nozomiishii/lefthook-config/dist/pre-push.js "{1}"');
});
