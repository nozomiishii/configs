import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, onTestFinished, test } from "vitest";
import { init } from ".";

interface TargetPackageJson {
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
}

const childPackages = new Set([
  "@nozomiishii/commitlint-config",
  "@nozomiishii/eslint-config",
  "@nozomiishii/lefthook-config",
  "@nozomiishii/oxfmt-config",
  "@nozomiishii/postinstall",
  "@nozomiishii/tsconfig",
]);

// 一時dirに利用先のプロジェクトを作る。
function createProject(devDependencies?: Record<string, string>): string {
  const root = mkdtempSync(path.join(tmpdir(), "nozo-configs-init-"));
  const cwd = path.join(root, "project");
  mkdirSync(cwd);
  writeFileSync(
    path.join(cwd, "package.json"),
    `${JSON.stringify({ devDependencies, name: "fixture", version: "1.0.0" }, null, 2)}\n`,
  );

  onTestFinished(() => {
    rmSync(root, { force: true, recursive: true });
  });

  return cwd;
}

function readGenerated(cwd: string, file: string): string {
  return readFileSync(path.join(cwd, file), "utf-8");
}

function readPackageJson(cwd: string): TargetPackageJson {
  return JSON.parse(readFileSync(path.join(cwd, "package.json"), "utf-8")) as TargetPackageJson;
}

// init は @nozomiishii/configs を devDependencies に追加する。
test("adds @nozomiishii/configs to devDependencies", async () => {
  const cwd = createProject();

  await init({ cwd });

  expect(readPackageJson(cwd).devDependencies?.["@nozomiishii/configs"]).toMatch(/^\d+\.\d+\.\d+$/);
});

// 子パッケージの peer は子の init が書くので、まとめて devDependencies に載る。
test("adds the peer dependencies of the child packages to devDependencies", async () => {
  const cwd = createProject();

  await init({ cwd });

  const { devDependencies } = readPackageJson(cwd);

  expect(Object.keys(devDependencies ?? {})).toStrictEqual(
    expect.arrayContaining(["eslint", "lefthook", "oxfmt", "typescript"]),
  );
});

// 子パッケージは configs 経由で入るので、利用先の devDependencies には書かない。
test("does not add the child package names to devDependencies", async () => {
  const cwd = createProject();

  await init({ cwd });

  const names = Object.keys(readPackageJson(cwd).devDependencies ?? {});

  expect(names.filter((name) => childPackages.has(name))).toStrictEqual([]);
});

// 既に直接依存していた子パッケージは configs に置き換えるため削除する。
test("removes an existing child package from devDependencies", async () => {
  const cwd = createProject({ "@nozomiishii/eslint-config": "2.5.0" });

  await init({ cwd });

  expect(readPackageJson(cwd).devDependencies?.["@nozomiishii/eslint-config"]).toBeUndefined();
});

// 削除した子パッケージ名は呼び出し元が表示できるよう戻り値で返す。
test("reports the removed child packages", async () => {
  const cwd = createProject({
    "@nozomiishii/oxfmt-config": "2.5.0",
    "@nozomiishii/tsconfig": "2.5.0",
    typescript: "6.0.3",
  });

  const result = await init({ cwd });

  expect(result.removedDependencies).toStrictEqual([
    "@nozomiishii/oxfmt-config",
    "@nozomiishii/tsconfig",
  ]);
});

// 直接依存を消したときは、monorepo の sub-package に残っている可能性を注意書きで返す。
test("notes that sub-packages may still depend on the removed packages", async () => {
  const cwd = createProject({ "@nozomiishii/eslint-config": "2.5.0" });

  const result = await init({ cwd });

  expect(result.notes).toStrictEqual([expect.stringContaining("Sub-packages")]);
});

// 何も消していないときは注意書きを出さない。
test("returns no note when nothing was removed", async () => {
  const cwd = createProject();

  const result = await init({ cwd });

  expect(result.notes).toStrictEqual([]);
});

// monorepo では sub-package に子パッケージが残っている可能性があるので、何も消していなくても注意書きを返す。
test("notes the sub-packages for a monorepo even when nothing was removed", async () => {
  const cwd = createProject();

  const result = await init({ cwd, monorepo: true });

  expect(result.notes).toStrictEqual([expect.stringContaining("Sub-packages")]);
});

// 設定ファイルの生成は子の init に任せる。
test("writes the config files of the child packages", async () => {
  const cwd = createProject();

  await init({ cwd });

  const generated = [
    "commitlint.config.ts",
    "eslint.config.ts",
    "lefthook.yaml",
    "oxfmt.config.ts",
  ].filter((file) => existsSync(path.join(cwd, file)));

  expect(generated).toStrictEqual([
    "commitlint.config.ts",
    "eslint.config.ts",
    "lefthook.yaml",
    "oxfmt.config.ts",
  ]);
});

// scripts の追加も子の init に任せる。
test("adds the scripts of the child packages", async () => {
  const cwd = createProject();

  await init({ cwd });

  const { scripts } = readPackageJson(cwd);

  expect(Object.keys(scripts ?? {})).toStrictEqual(
    expect.arrayContaining(["format", "lint", "postinstall"]),
  );
});

// eslint.config.ts は configs の subpath から import する。
test("points eslint.config.ts at the configs subpath", async () => {
  const cwd = createProject();

  await init({ cwd });

  const content = readGenerated(cwd, "eslint.config.ts");

  expect(content).toContain('from "@nozomiishii/configs/eslint"');
  expect(content).not.toContain("@nozomiishii/eslint-config");
});

// commitlint.config.ts は configs の subpath を extends する。
test("points commitlint.config.ts at the configs subpath", async () => {
  const cwd = createProject();

  await init({ cwd });

  const content = readGenerated(cwd, "commitlint.config.ts");

  expect(content).toContain("@nozomiishii/configs/commitlint");
  expect(content).not.toContain("@nozomiishii/commitlint-config");
});

// oxfmt.config.ts は configs の subpath から re-export する。
test("points oxfmt.config.ts at the configs subpath", async () => {
  const cwd = createProject();

  await init({ cwd });

  const content = readGenerated(cwd, "oxfmt.config.ts");

  expect(content).toContain('from "@nozomiishii/configs/oxfmt"');
  expect(content).not.toContain("@nozomiishii/oxfmt-config");
});

// lefthook.yaml は configs の recommended.yaml を extends する。
test("points lefthook.yaml at the configs recommended.yaml", async () => {
  const cwd = createProject();

  await init({ cwd });

  const content = readGenerated(cwd, "lefthook.yaml");

  expect(content).toContain("./node_modules/@nozomiishii/configs/recommended.yaml");
  expect(content).not.toContain("@nozomiishii/lefthook-config");
});

// 生成した設定ファイルは子パッケージ名を含まない。利用先が触る名前は configs だけにする。
test("does not leave any child package specifier in the generated config files", async () => {
  const cwd = createProject();

  await init({ cwd });

  const generated = ["commitlint.config.ts", "eslint.config.ts", "lefthook.yaml", "oxfmt.config.ts"]
    .map((file) => readGenerated(cwd, file))
    .join("\n");

  expect([...childPackages].filter((name) => generated.includes(name))).toStrictEqual([]);
});
