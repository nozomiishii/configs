import { execFileSync, spawnSync, type SpawnSyncReturns } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { buildCommitlintArgs, hasExplicitConfigFlag, resolveSelfConfigPath } from ".";

const packageRoot = fileURLToPath(new URL("../..", import.meta.url));
const binPath = path.join(packageRoot, "bin", "nozo-commitlint.js");

/**
 * package.json も node_modules も commitlint.config.ts も無い一時 repo で bin を起動する。
 * commitlint の `--edit` は git root を要求するため `git init` だけ行う。
 */
function lintInBareRepo(message: string): SpawnSyncReturns<string> {
  if (!existsSync(path.join(packageRoot, "dist", "cli", "bin.js"))) {
    throw new Error("dist not built — run `pnpm build` before `pnpm test`");
  }

  const cwd = mkdtempSync(path.join(tmpdir(), "nozo-commitlint-cli-"));

  try {
    execFileSync("git", ["init", "--quiet"], { cwd });

    const file = path.join(cwd, "COMMIT_EDITMSG");
    writeFileSync(file, message);

    return spawnSync(process.execPath, [binPath, "--edit", file, "--verbose"], {
      cwd,
      encoding: "utf-8",
    });
  } finally {
    rmSync(cwd, { force: true, recursive: true });
  }
}

describe("buildCommitlintArgs", () => {
  // 設定を指定しない呼び出しでは、自分の設定を絶対パスで下敷きにする。
  test("prepends the shared config as an absolute --extends", () => {
    expect(buildCommitlintArgs(["--edit", "MSG"], "/abs/config.js")).toStrictEqual([
      "--extends=/abs/config.js",
      "--edit",
      "MSG",
    ]);
  });

  // 引数が無い場合でも下敷きは載る。
  test("injects even with no arguments", () => {
    expect(buildCommitlintArgs([], "/abs/config.js")).toStrictEqual(["--extends=/abs/config.js"]);
  });

  // 呼び出し側が設定を明示したときは、こちらから注入しない。
  test.each([
    ["--config", "custom.ts"],
    ["-g", "custom.ts"],
    ["--config=custom.ts"],
    ["--extends", "other-config"],
    ["-x", "other-config"],
    ["--extends=other-config"],
  ])("passes through untouched when %s is given", (...argv) => {
    expect(buildCommitlintArgs(argv, "/abs/config.js")).toStrictEqual(argv);
  });
});

describe("hasExplicitConfigFlag", () => {
  // 設定に関係しない flag は素通しする。
  test("ignores unrelated flags", () => {
    expect(hasExplicitConfigFlag(["--edit", "MSG", "--verbose", "--last"])).toBe(false);
  });
});

describe("resolveSelfConfigPath", () => {
  // 名前解決を cwd に依存させないため、絶対パスで自分の設定を指す。
  test("resolves to an existing absolute path", () => {
    const resolved = resolveSelfConfigPath();

    expect(path.isAbsolute(resolved)).toBe(true);
    expect(existsSync(resolved)).toBe(true);
  });
});

// package.json も node_modules も持たない repo での実挙動を固定する。
// unit test が緑でも `extends` の名前解決が空振りして無言で素通りする、
// という壊れ方をしていたため、ここだけは実際に bin を起動して確かめる。
describe("nozo-commitlint in a repo without package.json or node_modules", () => {
  // type-enum の絞り込みが効く。
  test("rejects a type outside the allow-list", () => {
    const result = lintInBareRepo("refactor: reorganize modules\n");

    expect(result.stdout).toContain("type-enum");
    expect(result.status).not.toBe(0);
  });

  // custom rule が登録され、非 ASCII の body を弾く。
  test("rejects a non-ASCII body", () => {
    const result = lintInBareRepo("feat: add thing\n\n日本語の本文\n");

    expect(result.stdout).toContain("commit-message-ascii-only");
    expect(result.status).not.toBe(0);
  });

  // 正常なメッセージは通る。
  test("accepts a conforming message", () => {
    const result = lintInBareRepo("feat: add thing\n\nEnglish body only.\n");

    expect(result.stdout).toContain("found 0 problems");
    expect(result.status).toBe(0);
  });
});
