import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test as baseTest, expect, onTestFinished, vi } from "vitest";
import { resolvePackageManager, toolIds, tools } from "./init";

// npm_config_user_agent を一時的に差し替え、テスト終了時に元へ戻す。value 省略でランナー無しを再現する。
// process.env 直接操作は n/no-process-env で禁止のため vi.stubEnv を使う。
function stubUserAgent(value?: string) {
  vi.stubEnv("npm_config_user_agent", value);
  onTestFinished(() => {
    vi.unstubAllEnvs();
  });
}

const test = baseTest.extend<{ cwd: string }>({
  cwd: async ({ task: _ }, provide) => {
    const tmpDir = mkdtempSync(path.join(tmpdir(), "nozo-init-"));
    writeFileSync(
      path.join(tmpDir, "package.json"),
      `${JSON.stringify({ name: "fixture", version: "1.0.0" }, null, 2)}\n`,
    );

    await provide(tmpDir);

    rmSync(tmpDir, { force: true, recursive: true });
  },
});

// 全ツールの install スクリプトが throw せずに完走することだけを確認する。
// 各ツールの生成物・package.json 内容の検証は各 config パッケージ側の責務。
test("happy path: every tool's install script completes without throwing", async ({ cwd }) => {
  expect.hasAssertions();

  for (const id of toolIds) {
    await expect(tools[id].run({ cwd })).resolves.toBeUndefined();
  }
});

// lockfile も packageManager フィールドも無いとき、nozo を起動したランナーを使う。
test("falls back to the launching runner when the project has no config", async ({ cwd }) => {
  stubUserAgent("bun/1.3.11 npm/? node/v24 darwin arm64");

  await expect(resolvePackageManager(cwd)).resolves.toStrictEqual({
    agent: "bun",
    source: "runner",
  });
});

// 設定もランナーも無いときは throw する。
test("throws when neither project config nor runner is available", async ({ cwd }) => {
  stubUserAgent();

  await expect(resolvePackageManager(cwd)).rejects.toThrow(
    "Could not determine a package manager",
  );
});

// プロジェクトの lockfile はランナーより優先される。
test("prefers project config over the launching runner", async ({ cwd }) => {
  writeFileSync(path.join(cwd, "pnpm-lock.yaml"), "");
  stubUserAgent("bun/1.3.11 npm/? node/v24 darwin arm64");

  await expect(resolvePackageManager(cwd)).resolves.toStrictEqual({
    agent: "pnpm",
    source: "project",
  });
});
