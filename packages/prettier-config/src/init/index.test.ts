import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, test } from "vitest";
import { init } from ".";

type InitResult = {
  configContent: string;
  pkg: {
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
    type?: string;
  };
};

// 一時dirでinitを実行し、生成された package.json と prettier.config.ts を読み取る。
async function runInit(): Promise<InitResult> {
  const tmpDir = mkdtempSync(path.join(tmpdir(), "nozo-prettier-init-"));
  writeFileSync(
    path.join(tmpDir, "package.json"),
    `${JSON.stringify({ name: "fixture", version: "1.0.0" }, null, 2)}\n`,
  );

  try {
    await init({ cwd: tmpDir });

    const pkg = JSON.parse(
      readFileSync(path.join(tmpDir, "package.json"), "utf-8"),
    ) as InitResult["pkg"];
    const configContent = readFileSync(path.join(tmpDir, "prettier.config.ts"), "utf-8");

    return { configContent, pkg };
  } finally {
    rmSync(tmpDir, { force: true, recursive: true });
  }
}

// init は type:module を設定する。
test("init sets type:module", async () => {
  const { pkg } = await runInit();

  expect(pkg.type).toBe("module");
});

// init は @nozomiishii/prettier-config を devDependencies に追加する。
test("init adds @nozomiishii/prettier-config to devDependencies", async () => {
  const { pkg } = await runInit();

  expect(pkg.devDependencies?.["@nozomiishii/prettier-config"]).toMatch(/^\d+\.\d+\.\d+$/);
});

// init は prettier を devDependencies に追加する。
test("init adds prettier to devDependencies", async () => {
  const { pkg } = await runInit();

  expect(pkg.devDependencies?.prettier).toMatch(/^\d+\.\d+\.\d+$/);
});

// init は format script を追加する。
test("init adds format script", async () => {
  const { pkg } = await runInit();

  expect(pkg.scripts?.format).toBe("pnpm prettier . --check");
});

// init は format:fix script を追加する。
test("init adds format:fix script", async () => {
  const { pkg } = await runInit();

  expect(pkg.scripts?.["format:fix"]).toBe("pnpm prettier . --write");
});

// init は prettier script を追加する。
test("init adds prettier script", async () => {
  const { pkg } = await runInit();

  expect(pkg.scripts?.prettier).toBe("prettier --ignore-unknown --cache");
});

// init は prettier.config.ts を生成する。
test("init generates prettier.config.ts", async () => {
  const { configContent } = await runInit();

  expect(configContent.length).toBeGreaterThan(0);
});
