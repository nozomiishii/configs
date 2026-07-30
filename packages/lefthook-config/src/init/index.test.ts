import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test as baseTest, expect } from "vitest";
import { init } from ".";

type InitResult = {
  pkg: { devDependencies?: Record<string, string> };
  yamlContent: string;
};

const test = baseTest.extend<{ initResult: InitResult }>({
  initResult: async ({ task: _ }, provide) => {
    const tmpDir = mkdtempSync(path.join(tmpdir(), "nozo-lefthook-init-"));
    writeFileSync(
      path.join(tmpDir, "package.json"),
      `${JSON.stringify({ name: "fixture", version: "1.0.0" }, null, 2)}\n`,
    );

    await init({ cwd: tmpDir });

    const pkg = JSON.parse(
      readFileSync(path.join(tmpDir, "package.json"), "utf-8"),
    ) as InitResult["pkg"];
    const yamlContent = readFileSync(path.join(tmpDir, "lefthook.yaml"), "utf-8");

    await provide({ pkg, yamlContent });

    rmSync(tmpDir, { force: true, recursive: true });
  },
});

// init は @nozomiishii/lefthook-config を devDependencies に追加する。
test("init adds @nozomiishii/lefthook-config to devDependencies", ({ initResult }) => {
  expect(initResult.pkg.devDependencies?.["@nozomiishii/lefthook-config"]).toMatch(
    /^\d+\.\d+\.\d+$/,
  );
});

// init は lefthook を devDependencies に追加する。
test("init adds lefthook to devDependencies", ({ initResult }) => {
  expect(initResult.pkg.devDependencies?.lefthook).toMatch(/^\d+\.\d+\.\d+$/);
});

// init は lefthook.yaml を生成する。
test("init generates lefthook.yaml", ({ initResult }) => {
  expect(initResult.yamlContent.length).toBeGreaterThan(0);
});
