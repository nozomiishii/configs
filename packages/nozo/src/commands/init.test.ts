import { init as initConfigs } from "@nozomiishii/configs/init";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, onTestFinished, test, vi } from "vitest";
import { defaultToolIds, resolvePackageManager, runInit, toolIds, tools } from "./init";

vi.mock(import("@nozomiishii/configs/init"), () => ({
  init: vi.fn<typeof initConfigs>(() => Promise.resolve({ removedDependencies: [] })),
}));

// 一時dirに最小構成の package.json を作り、テスト終了時に削除する。
// detect は上位ディレクトリを遡るため、親には別の packageManager を置いて探索終端が効いていることも押さえる。
function createTestProject(): string {
  const tmpRoot = mkdtempSync(path.join(tmpdir(), "nozo-init-"));
  writeFileSync(
    path.join(tmpRoot, "package.json"),
    `${JSON.stringify({ name: "outside", packageManager: "npm@11.0.0" }, null, 2)}\n`,
  );

  const cwd = path.join(tmpRoot, "project");
  mkdirSync(cwd);
  writeFileSync(
    path.join(cwd, "package.json"),
    `${JSON.stringify({ name: "fixture", version: "1.0.0" }, null, 2)}\n`,
  );

  onTestFinished(() => {
    rmSync(tmpRoot, { force: true, recursive: true });
  });

  return cwd;
}

// npm_config_user_agent を一時的に差し替え、テスト終了時に元へ戻す。value 省略でランナー無しを再現する。
// process.env 直接操作は n/no-process-env で禁止のため vi.stubEnv を使う。
function stubUserAgent(value?: string) {
  vi.stubEnv("npm_config_user_agent", value);
  onTestFinished(() => {
    vi.unstubAllEnvs();
  });
}

// 全ツールの install スクリプトが throw せずに完走することだけを確認する。
// 各ツールの生成物・package.json 内容の検証は各 config パッケージ側の責務。
test("happy path: every tool's install script completes without throwing", async () => {
  expect.hasAssertions();

  const cwd = createTestProject();

  for (const id of toolIds) {
    await expect(tools[id].run({ cwd })).resolves.toBeUndefined();
  }
}, 15_000);

// Prettier は選択肢に残し、デフォルトの formatter は oxfmt だけにする。
test("keeps Prettier available as an opt-in formatter", () => {
  expect(toolIds).toContain("prettier");
  expect(defaultToolIds).not.toContain("prettier");
  expect(defaultToolIds).toContain("oxfmt");
});

// lockfile も packageManager フィールドも無いとき、nozo を起動したランナーを使う。
test("falls back to the launching runner when the project has no config", async () => {
  const cwd = createTestProject();
  stubUserAgent("bun/1.3.11 npm/? node/v24 darwin arm64");

  await expect(resolvePackageManager(cwd, cwd)).resolves.toStrictEqual({
    agent: "bun",
    source: "runner",
  });
});

// 設定もランナーも無いときは throw する。
test("throws when neither project config nor runner is available", async () => {
  const cwd = createTestProject();
  stubUserAgent();

  await expect(resolvePackageManager(cwd, cwd)).rejects.toThrow(
    "Could not determine a package manager",
  );
});

// プロジェクトの lockfile はランナーより優先される。
test("prefers project config over the launching runner", async () => {
  const cwd = createTestProject();
  writeFileSync(path.join(cwd, "pnpm-lock.yaml"), "");
  stubUserAgent("bun/1.3.11 npm/? node/v24 darwin arm64");

  await expect(resolvePackageManager(cwd, cwd)).resolves.toStrictEqual({
    agent: "pnpm",
    source: "project",
  });
});

// 呼び出し記録はテストごとに独立させる。lifecycle hook を使わずに helper 側で前後を掃除する。
function trackConfigsInit() {
  const mock = vi.mocked(initConfigs);
  mock.mockClear();
  onTestFinished(() => {
    mock.mockClear();
  });

  return mock;
}

// configs モードは @nozomiishii/configs の init だけを、検出した package manager 付きで 1 回呼ぶ。
test("runInit in configs mode calls the configs init once with the agent", async () => {
  const cwd = createTestProject();
  const mock = trackConfigsInit();

  await runInit({ agent: "pnpm", cwd, mode: "configs" });

  expect(mock).toHaveBeenCalledExactlyOnceWith({ agent: "pnpm", cwd });
});

// ESLint の preset と monorepo の答えは configs の init へそのまま渡す。
test("runInit in configs mode forwards the ESLint answers", async () => {
  const cwd = createTestProject();
  const mock = trackConfigsInit();

  await runInit({
    agent: "pnpm",
    cwd,
    eslint: { monorepo: true, preset: "node" },
    mode: "configs",
  });

  expect(mock).toHaveBeenCalledExactlyOnceWith({
    agent: "pnpm",
    cwd,
    monorepo: true,
    preset: "node",
  });
});

// individual モードは従来どおり子パッケージを個別に入れる。
test("runInit in individual mode does not call the configs init", async () => {
  const cwd = createTestProject();
  const mock = trackConfigsInit();

  await runInit({ agent: "pnpm", cwd, mode: "individual", tools: ["postinstall"] });

  expect(mock).not.toHaveBeenCalled();
});

// configs が消した子パッケージ名は、呼び出し元が表示できるよう log へ流す。
test("runInit in configs mode reports the removed dependencies through log", async () => {
  const cwd = createTestProject();
  const mock = trackConfigsInit();
  mock.mockResolvedValueOnce({ removedDependencies: ["@nozomiishii/eslint-config"] });
  const messages: string[] = [];

  await runInit({
    agent: "pnpm",
    cwd,
    log: (message) => {
      messages.push(message);
    },
    mode: "configs",
  });

  expect(messages).toStrictEqual(
    expect.arrayContaining([
      expect.stringContaining("Removed @nozomiishii/eslint-config from devDependencies"),
    ]),
  );
});
