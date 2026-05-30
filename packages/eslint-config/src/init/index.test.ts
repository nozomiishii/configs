import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, test } from "vitest";
import { init, type PresetId } from ".";

type InitResult = {
  configContent: string;
  pkg: {
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
  };
};

// 一時dirでinitを実行し、生成された package.json と eslint.config.ts を読み取る
async function runInit(preset?: PresetId): Promise<InitResult> {
  const tmpDir = mkdtempSync(path.join(tmpdir(), "nozo-eslint-init-"));
  writeFileSync(
    path.join(tmpDir, "package.json"),
    `${JSON.stringify({ name: "fixture", version: "1.0.0" }, null, 2)}\n`,
  );

  await init(preset === undefined ? { cwd: tmpDir } : { cwd: tmpDir, preset });

  const pkg = JSON.parse(
    readFileSync(path.join(tmpDir, "package.json"), "utf8"),
  ) as InitResult["pkg"];
  const configContent = readFileSync(path.join(tmpDir, "eslint.config.ts"), "utf8");

  rmSync(tmpDir, { force: true, recursive: true });

  return { configContent, pkg };
}

test("init adds @nozomiishii/eslint-config to devDependencies", async () => {
  const { pkg } = await runInit();

  expect(pkg.devDependencies?.["@nozomiishii/eslint-config"]).toMatch(/^\d+\.\d+\.\d+$/);
});

test("init adds eslint to devDependencies", async () => {
  const { pkg } = await runInit();

  expect(pkg.devDependencies?.eslint).toMatch(/^\d+\.\d+\.\d+$/);
});

test("init adds typescript to devDependencies", async () => {
  const { pkg } = await runInit();

  expect(pkg.devDependencies?.typescript).toMatch(/^\d+\.\d+\.\d+$/);
});

test("init adds eslint script", async () => {
  const { pkg } = await runInit();

  expect(pkg.scripts?.eslint).toBe("eslint --max-warnings=0 --cache");
});

test("init adds lint script", async () => {
  const { pkg } = await runInit();

  expect(pkg.scripts?.lint).toBe("pnpm eslint");
});

test("init adds lint:fix script", async () => {
  const { pkg } = await runInit();

  expect(pkg.scripts?.["lint:fix"]).toBe("pnpm eslint --fix");
});

// preset 未指定は nextjs starter を書き出す
test("init defaults to the nextjs preset", async () => {
  const { configContent } = await runInit();

  expect(configContent).toContain("nextjs");
});

// 既定の starter は node bundle を使わない
test("the default starter does not use the node bundle", async () => {
  const { configContent } = await runInit();

  expect(configContent).not.toContain("...node()");
});

// preset=node は node bundle を書き出す
test("init with the node preset writes the node bundle", async () => {
  const { configContent } = await runInit("node");

  expect(configContent).toContain("...node()");
});

// node starter は nextjs を参照しない
test("the node starter does not reference nextjs", async () => {
  const { configContent } = await runInit("node");

  expect(configContent).not.toContain("nextjs");
});
