import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test as baseTest, expect } from "vitest";

import { init } from "./index.js";

type InitResult = {
  pkg: {
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
  };
};

const test = baseTest.extend<{ initResult: InitResult }>({
  initResult: async ({ task: _task }, provide) => {
    const tmpDir = mkdtempSync(path.join(tmpdir(), "nozo-postinstall-init-"));
    writeFileSync(
      path.join(tmpDir, "package.json"),
      `${JSON.stringify({ name: "fixture", version: "1.0.0" }, null, 2)}\n`,
    );

    await init({ cwd: tmpDir });

    const pkg = JSON.parse(
      readFileSync(path.join(tmpDir, "package.json"), "utf8"),
    ) as InitResult["pkg"];

    await provide({ pkg });

    rmSync(tmpDir, { force: true, recursive: true });
  },
});

test("init adds @nozomiishii/postinstall to devDependencies", ({ initResult }) => {
  expect(initResult.pkg.devDependencies?.["@nozomiishii/postinstall"]).toMatch(/^\d+\.\d+\.\d+$/);
});

test("init adds postinstall script", ({ initResult }) => {
  expect(initResult.pkg.scripts?.postinstall).toBe("postinstall");
});
