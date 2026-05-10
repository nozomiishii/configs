import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test as baseTest, expect } from "vitest";

import { init } from "./index.js";

type InitResult = {
  configContent: string;
  pkg: { devDependencies?: Record<string, string> };
};

const test = baseTest.extend<{ initResult: InitResult }>({
  initResult: async ({ task: _task }, provide) => {
    const tmpDir = mkdtempSync(path.join(tmpdir(), "nozo-commitlint-init-"));
    writeFileSync(
      path.join(tmpDir, "package.json"),
      `${JSON.stringify({ name: "fixture", version: "1.0.0" }, null, 2)}\n`,
    );

    await init({ cwd: tmpDir });

    const pkg = JSON.parse(
      readFileSync(path.join(tmpDir, "package.json"), "utf8"),
    ) as InitResult["pkg"];
    const configContent = readFileSync(path.join(tmpDir, "commitlint.config.ts"), "utf8");

    await provide({ configContent, pkg });

    rmSync(tmpDir, { force: true, recursive: true });
  },
});

test("init adds @nozomiishii/commitlint-config to devDependencies", ({ initResult }) => {
  expect(initResult.pkg.devDependencies?.["@nozomiishii/commitlint-config"]).toMatch(
    /^\d+\.\d+\.\d+$/,
  );
});

test("init generates commitlint.config.ts", ({ initResult }) => {
  expect(initResult.configContent.length).toBeGreaterThan(0);
});
