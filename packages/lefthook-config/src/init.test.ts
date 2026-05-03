import { execFileSync, execSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test as baseTest, expect } from "vitest";

const packageDir = path.resolve(import.meta.dirname, "..");
const initBin = path.resolve(packageDir, "dist/init.js");

type InitResult = {
  pkg: { devDependencies?: Record<string, string> };
  yamlContent: string;
};

// Fixtures: "build は file 内で 1 回" + "tmp dir は test 毎に独立して自動クリーンアップ"。
// hook を使わず test.extend で setup/teardown を test と疎結合に保つ。
// provide は vitest の use を rename したもの (use 接頭辞は React Hook と判定されるため)。
const test = baseTest
  .extend<{ built: true }>({
    built: [
      async ({ task: _task }, provide) => {
        execSync("pnpm build", { cwd: packageDir });
        await provide(true);
      },
      { scope: "file" },
    ],
  })
  .extend<{ initResult: InitResult }>({
    initResult: async ({ built: _built }, provide) => {
      const tmpDir = mkdtempSync(path.join(tmpdir(), "nozo-lefthook-init-"));
      writeFileSync(
        path.join(tmpDir, "package.json"),
        `${JSON.stringify({ name: "fixture", version: "1.0.0" }, null, 2)}\n`,
      );
      execFileSync(process.execPath, [initBin], { cwd: tmpDir });
      const pkg = JSON.parse(
        readFileSync(path.join(tmpDir, "package.json"), "utf8"),
      ) as InitResult["pkg"];
      const yamlContent = readFileSync(path.join(tmpDir, "lefthook.yaml"), "utf8");

      await provide({ pkg, yamlContent });

      rmSync(tmpDir, { force: true, recursive: true });
    },
  });

test("init adds @nozomiishii/lefthook-config to devDependencies", ({ initResult }) => {
  expect(initResult.pkg.devDependencies?.["@nozomiishii/lefthook-config"]).toMatch(/^\d+\.\d+\.\d+/);
});

test("init adds lefthook to devDependencies", ({ initResult }) => {
  expect(initResult.pkg.devDependencies?.lefthook).toMatch(/^\d+\.\d+\.\d+/);
});

test("init generates lefthook.yaml", ({ initResult }) => {
  expect(initResult.yamlContent.length).toBeGreaterThan(0);
});
