import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test as baseTest, expect } from "vitest";

import { init } from "./index.js";

type InitResult = {
  configContent: string;
  pkg: {
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
    type?: string;
  };
};

const test = baseTest.extend<{ initResult: InitResult }>({
  initResult: async ({ task: _ }, provide) => {
    const tmpDir = mkdtempSync(path.join(tmpdir(), "nozo-prettier-init-"));
    writeFileSync(
      path.join(tmpDir, "package.json"),
      `${JSON.stringify({ name: "fixture", version: "1.0.0" }, null, 2)}\n`,
    );

    await init({ cwd: tmpDir });

    const pkg = JSON.parse(
      readFileSync(path.join(tmpDir, "package.json"), "utf8"),
    ) as InitResult["pkg"];
    const configContent = readFileSync(path.join(tmpDir, "prettier.config.ts"), "utf8");

    await provide({ configContent, pkg });

    rmSync(tmpDir, { force: true, recursive: true });
  },
});

test("init sets type:module", ({ initResult }) => {
  expect(initResult.pkg.type).toBe("module");
});

test("init adds @nozomiishii/prettier-config to devDependencies", ({ initResult }) => {
  expect(initResult.pkg.devDependencies?.["@nozomiishii/prettier-config"]).toMatch(
    /^\d+\.\d+\.\d+$/,
  );
});

test("init adds prettier to devDependencies", ({ initResult }) => {
  expect(initResult.pkg.devDependencies?.prettier).toMatch(/^\d+\.\d+\.\d+$/);
});

test("init adds format script", ({ initResult }) => {
  expect(initResult.pkg.scripts?.format).toBe("pnpm prettier . --check");
});

test("init adds format:fix script", ({ initResult }) => {
  expect(initResult.pkg.scripts?.["format:fix"]).toBe("pnpm prettier . --write");
});

test("init adds prettier script", ({ initResult }) => {
  expect(initResult.pkg.scripts?.prettier).toBe("prettier --ignore-unknown --cache");
});

test("init generates prettier.config.ts", ({ initResult }) => {
  expect(initResult.configContent.length).toBeGreaterThan(0);
});
