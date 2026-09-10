import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, test } from "vitest";
import { init } from ".";

interface InitResult {
  configContent: string;
  pkg: { devDependencies?: Record<string, string> };
}

// 一時dirでinitを実行し、生成された package.json と commitlint.config.ts を読み取る。
async function runInit(
  options: { shouldAddSelfDependency?: boolean; specifier?: string } = {},
): Promise<InitResult> {
  const tmpDir = mkdtempSync(path.join(tmpdir(), "nozo-commitlint-init-"));
  writeFileSync(
    path.join(tmpDir, "package.json"),
    `${JSON.stringify({ name: "fixture", version: "1.0.0" }, null, 2)}\n`,
  );

  try {
    await init({ cwd: tmpDir, ...options });

    const pkg = JSON.parse(
      readFileSync(path.join(tmpDir, "package.json"), "utf-8"),
    ) as InitResult["pkg"];
    const configContent = readFileSync(path.join(tmpDir, "commitlint.config.ts"), "utf-8");

    return { configContent, pkg };
  } finally {
    rmSync(tmpDir, { force: true, recursive: true });
  }
}

// init は @nozomiishii/commitlint-config を devDependencies に追加する。
test("init adds @nozomiishii/commitlint-config to devDependencies", async () => {
  const { pkg } = await runInit();

  expect(pkg.devDependencies?.["@nozomiishii/commitlint-config"]).toMatch(/^\d+\.\d+\.\d+$/);
});

// init は commitlint.config.ts を生成する。
test("init generates commitlint.config.ts", async () => {
  const { configContent } = await runInit();

  expect(configContent.length).toBeGreaterThan(0);
});

// configs メタパッケージから呼ぶときは、自パッケージ名を利用先に書かせない。
test("init skips the self dependency when shouldAddSelfDependency is false", async () => {
  const { pkg } = await runInit({ shouldAddSelfDependency: false });

  expect(pkg.devDependencies?.["@nozomiishii/commitlint-config"]).toBeUndefined();
});

// configs メタパッケージ経由で入れるときは、starter の参照先を specifier に差し替える。
test("init points the starter at the given specifier", async () => {
  const { configContent } = await runInit({ specifier: "@nozomiishii/configs/commitlint" });

  expect(configContent).toContain("@nozomiishii/configs/commitlint");
  expect(configContent).not.toContain("commitlint-config");
});
