import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, test } from "vitest";
import { init } from ".";

interface InitResult {
  pkg: { devDependencies?: Record<string, string> };
  yamlContent: string;
}

// 一時dirでinitを実行し、生成された package.json と lefthook.yaml を読み取る。
async function runInit(
  options: { shouldAddSelfDependency?: boolean; specifier?: string } = {},
): Promise<InitResult> {
  const tmpDir = mkdtempSync(path.join(tmpdir(), "nozo-lefthook-init-"));
  writeFileSync(
    path.join(tmpDir, "package.json"),
    `${JSON.stringify({ name: "fixture", version: "1.0.0" }, null, 2)}\n`,
  );

  try {
    await init({ cwd: tmpDir, ...options });

    const pkg = JSON.parse(
      readFileSync(path.join(tmpDir, "package.json"), "utf-8"),
    ) as InitResult["pkg"];
    const yamlContent = readFileSync(path.join(tmpDir, "lefthook.yaml"), "utf-8");

    return { pkg, yamlContent };
  } finally {
    rmSync(tmpDir, { force: true, recursive: true });
  }
}

// init は @nozomiishii/lefthook-config を devDependencies に追加する。
test("init adds @nozomiishii/lefthook-config to devDependencies", async () => {
  const { pkg } = await runInit();

  expect(pkg.devDependencies?.["@nozomiishii/lefthook-config"]).toMatch(/^\d+\.\d+\.\d+$/);
});

// init は lefthook を devDependencies に追加する。
test("init adds lefthook to devDependencies", async () => {
  const { pkg } = await runInit();

  expect(pkg.devDependencies?.lefthook).toMatch(/^\d+\.\d+\.\d+$/);
});

// init は lefthook.yaml を生成する。
test("init generates lefthook.yaml", async () => {
  const { yamlContent } = await runInit();

  expect(yamlContent.length).toBeGreaterThan(0);
});

// configs メタパッケージから呼ぶときは、自パッケージ名を利用先に書かせない。
test("init skips the self dependency when shouldAddSelfDependency is false", async () => {
  const { pkg } = await runInit({ shouldAddSelfDependency: false });

  expect(pkg.devDependencies?.["@nozomiishii/lefthook-config"]).toBeUndefined();
});

// configs メタパッケージ経由で入れるときは、starter の extends 先を specifier のパッケージに差し替える。
test("init points the starter at the given specifier", async () => {
  const { yamlContent } = await runInit({ specifier: "@nozomiishii/configs" });

  expect(yamlContent).toContain("./node_modules/@nozomiishii/configs/recommended.yaml");
  expect(yamlContent).not.toContain("lefthook-config");
});
