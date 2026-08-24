import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { resolveArgs } from "./resolve-args";

const bin = fileURLToPath(new URL("../bin/nozo-commitlint.js", import.meta.url));

function lintIn(dir: string, message: string) {
  return spawnSync(process.execPath, [bin], {
    cwd: dir,
    encoding: "utf-8",
    input: message,
  });
}

function withTempDir<T>(run: (dir: string) => T): T {
  const dir = mkdtempSync(path.join(tmpdir(), "nozo-commitlint-"));

  try {
    return run(dir);
  } finally {
    rmSync(dir, { force: true, recursive: true });
  }
}

describe("explicit config flag", () => {
  // --config 明示時は一切書き換えない。
  test("keeps args untouched when --config is passed", () => {
    const args = ["--config", "custom.config.ts", "--verbose"];

    expect(resolveArgs(args)).toStrictEqual(args);
  });

  // alias の -g でも書き換えない。
  test("keeps args untouched when -g is passed", () => {
    const args = ["-g", "custom.config.ts"];

    expect(resolveArgs(args)).toStrictEqual(args);
  });

  // --config=path 形式でも書き換えない。
  test("keeps args untouched when --config=path is passed", () => {
    const args = ["--config=custom.config.ts"];

    expect(resolveArgs(args)).toStrictEqual(args);
  });
});

describe("bundled config injection", () => {
  // 既定では同梱 config を --config で明示注入し、元の args は保持する。
  test("appends --config with the bundled config by default", () => {
    const result = resolveArgs(["--edit", "msg"]);

    expect(result.slice(0, 3)).toStrictEqual(["--edit", "msg", "--config"]);
  });

  // 注入するパスは実在する (build 済みの同梱 config)。
  test("injects a config path that exists on disk", () => {
    const result = resolveArgs([]);

    expect(existsSync(result[1] ?? "")).toBe(true);
  });
});

// bin を実際に spawn して、commitlint が同梱 config だけを見ることを固定する。
describe("nozo-commitlint bin (e2e)", () => {
  // config の無いプロジェクトでも同梱ルールで検査される。
  test("rejects a scoped commit in a directory without config", () => {
    const result = withTempDir((dir) => lintIn(dir, "feat(api): add foo"));

    expect(result.status).not.toBe(0);
  });

  // ローカル config は読まない。ルールを全無効化する config を置いても
  // 同梱ルールが適用される (古い/ローカル config が紛れ込む事故の regression test)。
  test("ignores a local config that disables all rules", () => {
    const result = withTempDir((dir) => {
      writeFileSync(path.join(dir, "commitlint.config.mjs"), "export default { rules: {} };\n");

      return lintIn(dir, "feat(api): add foo");
    });

    expect(result.status).not.toBe(0);
  });

  // 同梱ルールに沿ったメッセージは通る。
  test("accepts a conventional commit message", () => {
    const result = withTempDir((dir) => lintIn(dir, "feat: add foo"));

    expect(result.status).toBe(0);
  });
});
