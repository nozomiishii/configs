import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test as baseTest, expect } from "vitest";
import { init } from ".";

type InitResult = {
  configContent: string;
  pkg: {
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
  };
};

const test = baseTest.extend<{ initResult: InitResult }>({
  initResult: async ({ task: _ }, provide) => {
    const tmpDir = mkdtempSync(path.join(tmpdir(), "nozo-eslint-init-"));
    writeFileSync(
      path.join(tmpDir, "package.json"),
      `${JSON.stringify({ name: "fixture", version: "1.0.0" }, null, 2)}\n`,
    );

    await init({ cwd: tmpDir });

    const pkg = JSON.parse(
      readFileSync(path.join(tmpDir, "package.json"), "utf8"),
    ) as InitResult["pkg"];
    const configContent = readFileSync(path.join(tmpDir, "eslint.config.ts"), "utf8");

    await provide({ configContent, pkg });

    rmSync(tmpDir, { force: true, recursive: true });
  },
});

test("init adds @nozomiishii/eslint-config to devDependencies", ({ initResult }) => {
  expect(initResult.pkg.devDependencies?.["@nozomiishii/eslint-config"]).toMatch(/^\d+\.\d+\.\d+$/);
});

test("init adds eslint to devDependencies", ({ initResult }) => {
  expect(initResult.pkg.devDependencies?.eslint).toMatch(/^\d+\.\d+\.\d+$/);
});

test("init adds typescript to devDependencies", ({ initResult }) => {
  expect(initResult.pkg.devDependencies?.typescript).toMatch(/^\d+\.\d+\.\d+$/);
});

test("init adds eslint script", ({ initResult }) => {
  expect(initResult.pkg.scripts?.eslint).toBe("eslint --max-warnings=0 --cache");
});

test("init adds lint script", ({ initResult }) => {
  expect(initResult.pkg.scripts?.lint).toBe("pnpm eslint");
});

test("init adds lint:fix script", ({ initResult }) => {
  expect(initResult.pkg.scripts?.["lint:fix"]).toBe("pnpm eslint --fix");
});

test("init generates eslint.config.ts", ({ initResult }) => {
  expect(initResult.configContent.length).toBeGreaterThan(0);
});
