import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test as baseTest, expect } from "vitest";
import { toolIds, tools } from "./init.js";

const test = baseTest.extend<{ cwd: string }>({
  cwd: async ({ task: _task }, provide) => {
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
