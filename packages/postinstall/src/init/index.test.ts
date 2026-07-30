import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, test } from "vitest";
import { init } from ".";

type InitResult = {
  pkg: {
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
  };
};

// 一時dirでinitを実行し、生成された package.json を読み取る。
async function runInit(): Promise<InitResult> {
  const tmpDir = mkdtempSync(path.join(tmpdir(), "nozo-postinstall-init-"));
  writeFileSync(
    path.join(tmpDir, "package.json"),
    `${JSON.stringify({ name: "fixture", version: "1.0.0" }, null, 2)}\n`,
  );

  try {
    await init({ cwd: tmpDir });

    const pkg = JSON.parse(
      readFileSync(path.join(tmpDir, "package.json"), "utf-8"),
    ) as InitResult["pkg"];

    return { pkg };
  } finally {
    rmSync(tmpDir, { force: true, recursive: true });
  }
}

// init は @nozomiishii/postinstall を devDependencies に追加する。
test("init adds @nozomiishii/postinstall to devDependencies", async () => {
  const { pkg } = await runInit();

  expect(pkg.devDependencies?.["@nozomiishii/postinstall"]).toMatch(/^\d+\.\d+\.\d+$/);
});

// init は postinstall script を追加する。
test("init adds postinstall script", async () => {
  const { pkg } = await runInit();

  expect(pkg.scripts?.postinstall).toBe("postinstall");
});
