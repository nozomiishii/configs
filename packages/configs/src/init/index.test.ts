import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, onTestFinished, test } from "vitest";
import { parse } from "yaml";
import { init } from ".";

interface TargetPackageJson {
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
}

interface WorkspaceYaml {
  publicHoistPattern?: string[];
}

const childPackages = new Set([
  "@nozomiishii/commitlint-config",
  "@nozomiishii/eslint-config",
  "@nozomiishii/lefthook-config",
  "@nozomiishii/oxfmt-config",
  "@nozomiishii/postinstall",
  "@nozomiishii/tsconfig",
]);

// 一時dirに root/project の2階層を作る。上位ディレクトリ探索を試すため project の親も要る。
// root に .git を置き、探索が一時dirの外へ出て実在の pnpm-workspace.yaml を掴まないようにする。
function createProject(devDependencies?: Record<string, string>): { cwd: string; root: string } {
  const root = mkdtempSync(path.join(tmpdir(), "nozo-configs-init-"));
  mkdirSync(path.join(root, ".git"));
  const cwd = path.join(root, "project");
  mkdirSync(cwd);
  writeFileSync(
    path.join(cwd, "package.json"),
    `${JSON.stringify({ devDependencies, name: "fixture", version: "1.0.0" }, null, 2)}\n`,
  );

  onTestFinished(() => {
    rmSync(root, { force: true, recursive: true });
  });

  return { cwd, root };
}

function readHoistPatterns(dir: string): string[] | undefined {
  return (parse(readWorkspaceYaml(dir)) as WorkspaceYaml).publicHoistPattern;
}

function readPackageJson(cwd: string): TargetPackageJson {
  return JSON.parse(readFileSync(path.join(cwd, "package.json"), "utf-8")) as TargetPackageJson;
}

function readWorkspaceYaml(dir: string): string {
  return readFileSync(path.join(dir, "pnpm-workspace.yaml"), "utf-8");
}

// init は @nozomiishii/configs を devDependencies に追加する。
test("adds @nozomiishii/configs to devDependencies", async () => {
  const { cwd } = createProject();

  await init({ cwd });

  expect(readPackageJson(cwd).devDependencies?.["@nozomiishii/configs"]).toMatch(/^\d+\.\d+\.\d+$/);
});

// 子パッケージの peer は子の init が書くので、まとめて devDependencies に載る。
test("adds the peer dependencies of the child packages to devDependencies", async () => {
  const { cwd } = createProject();

  await init({ cwd });

  const { devDependencies } = readPackageJson(cwd);

  expect(Object.keys(devDependencies ?? {})).toStrictEqual(
    expect.arrayContaining(["eslint", "lefthook", "oxfmt", "typescript"]),
  );
});

// 子パッケージは configs 経由で入るので、利用先の devDependencies には書かない。
test("does not add the child package names to devDependencies", async () => {
  const { cwd } = createProject();

  await init({ cwd });

  const names = Object.keys(readPackageJson(cwd).devDependencies ?? {});

  expect(names.filter((name) => childPackages.has(name))).toStrictEqual([]);
});

// 既に直接依存していた子パッケージは configs に置き換えるため削除する。
test("removes an existing child package from devDependencies", async () => {
  const { cwd } = createProject({ "@nozomiishii/eslint-config": "2.5.0" });

  await init({ cwd });

  expect(readPackageJson(cwd).devDependencies?.["@nozomiishii/eslint-config"]).toBeUndefined();
});

// 削除した子パッケージ名は呼び出し元が表示できるよう戻り値で返す。
test("reports the removed child packages", async () => {
  const { cwd } = createProject({
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

// 設定ファイルの生成は子の init に任せる。
test("writes the config files of the child packages", async () => {
  const { cwd } = createProject();

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
  const { cwd } = createProject();

  await init({ cwd });

  const { scripts } = readPackageJson(cwd);

  expect(Object.keys(scripts ?? {})).toStrictEqual(
    expect.arrayContaining(["format", "lint", "postinstall"]),
  );
});

// pnpm では publicHoistPattern が要るので、pnpm-workspace.yaml が無ければ cwd に作る。
test("creates pnpm-workspace.yaml in cwd when no workspace file exists", async () => {
  const { cwd } = createProject();

  await init({ agent: "pnpm", cwd });

  expect(readHoistPatterns(cwd)).toStrictEqual(["@nozomiishii/*"]);
});

// 既存の publicHoistPattern には追記し、順序も既存の後ろに置く。
test("appends the hoist pattern to an existing publicHoistPattern list", async () => {
  const { cwd } = createProject();
  writeFileSync(
    path.join(cwd, "pnpm-workspace.yaml"),
    '# keep me\npackages:\n  - "packages/*"\n\npublicHoistPattern:\n  - "@types/*"\n',
  );

  await init({ agent: "pnpm", cwd });

  expect(readHoistPatterns(cwd)).toStrictEqual(["@types/*", "@nozomiishii/*"]);
});

// 既存の pnpm-workspace.yaml はコメントと他のキーを残したまま追記する。
test("keeps existing keys and comments in pnpm-workspace.yaml", async () => {
  const { cwd } = createProject();
  writeFileSync(
    path.join(cwd, "pnpm-workspace.yaml"),
    '# keep me\npackages:\n  - "packages/*"\n\npublicHoistPattern:\n  - "@types/*"\n',
  );

  await init({ agent: "pnpm", cwd });

  const yaml = readWorkspaceYaml(cwd);

  expect(yaml).toContain("# keep me");
  expect(yaml).toContain("packages/*");
});

// 既に @nozomiishii/* があれば追記しない。
test("does not duplicate an existing @nozomiishii/* hoist pattern", async () => {
  const { cwd } = createProject();
  writeFileSync(
    path.join(cwd, "pnpm-workspace.yaml"),
    'publicHoistPattern:\n  - "@nozomiishii/*"\n',
  );

  await init({ agent: "pnpm", cwd });

  expect(readHoistPatterns(cwd)).toStrictEqual(["@nozomiishii/*"]);
});

// キーだけあって値が空のときも、リストとして書き直す。
test("writes the hoist pattern when publicHoistPattern has a null value", async () => {
  const { cwd } = createProject();
  writeFileSync(
    path.join(cwd, "pnpm-workspace.yaml"),
    '# keep me\npackages:\n  - "packages/*"\n\npublicHoistPattern:\n',
  );

  await init({ agent: "pnpm", cwd });

  expect(readHoistPatterns(cwd)).toStrictEqual(["@nozomiishii/*"]);
  expect(readWorkspaceYaml(cwd)).toContain("# keep me");
});

// コメントだけのファイルにもキーを足せる。
test("writes the hoist pattern into a comment-only pnpm-workspace.yaml", async () => {
  const { cwd } = createProject();
  writeFileSync(path.join(cwd, "pnpm-workspace.yaml"), "# keep me\n# and me\n");

  await init({ agent: "pnpm", cwd });

  expect(readHoistPatterns(cwd)).toStrictEqual(["@nozomiishii/*"]);
  expect(readWorkspaceYaml(cwd)).toContain("# keep me");
});

// flow 記法のリストにも追記できる。
test("appends the hoist pattern to a flow-style publicHoistPattern list", async () => {
  const { cwd } = createProject();
  writeFileSync(
    path.join(cwd, "pnpm-workspace.yaml"),
    'packages:\n  - "packages/*"\n\npublicHoistPattern: ["@types/*"]\n',
  );

  await init({ agent: "pnpm", cwd });

  expect(readHoistPatterns(cwd)).toStrictEqual(["@types/*", "@nozomiishii/*"]);
  expect(readWorkspaceYaml(cwd)).toContain("packages/*");
});

// 空ファイルは中身が無いだけなので、新規作成と同じ結果にする。
test("writes the hoist pattern into an empty pnpm-workspace.yaml", async () => {
  const { cwd } = createProject();
  writeFileSync(path.join(cwd, "pnpm-workspace.yaml"), "");

  await init({ agent: "pnpm", cwd });

  expect(readHoistPatterns(cwd)).toStrictEqual(["@nozomiishii/*"]);
});

// monorepo の package から実行しても、書き込み先は上位の pnpm-workspace.yaml にする。
test("appends to the nearest pnpm-workspace.yaml in a parent directory", async () => {
  const { cwd, root } = createProject();
  writeFileSync(path.join(root, "pnpm-workspace.yaml"), 'packages:\n  - "project"\n');

  await init({ agent: "pnpm", cwd });

  expect(readHoistPatterns(root)).toStrictEqual(["@nozomiishii/*"]);
});

// 上位探索は repo の外へ出ないので、.git より上の pnpm-workspace.yaml は書き換えない。
test("stops the upward search at a .git boundary", async () => {
  const { cwd, root } = createProject();
  const outside = 'packages:\n  - "project"\n';
  writeFileSync(path.join(root, "pnpm-workspace.yaml"), outside);
  mkdirSync(path.join(cwd, ".git"));

  await init({ agent: "pnpm", cwd });

  expect(readWorkspaceYaml(root)).toBe(outside);
});

// .git で探索が止まったときは、利用先の cwd に新しく作る。
test("creates pnpm-workspace.yaml in cwd when the search stops at a .git boundary", async () => {
  const { cwd, root } = createProject();
  writeFileSync(path.join(root, "pnpm-workspace.yaml"), 'packages:\n  - "project"\n');
  mkdirSync(path.join(cwd, ".git"));

  await init({ agent: "pnpm", cwd });

  expect(readHoistPatterns(cwd)).toStrictEqual(["@nozomiishii/*"]);
});

// publicHoistPattern がリストでないときは、上書きせずに手直しを求める。
test("throws when publicHoistPattern is not a list", async () => {
  const { cwd } = createProject();
  writeFileSync(path.join(cwd, "pnpm-workspace.yaml"), 'publicHoistPattern: "@types/*"\n');

  await expect(init({ agent: "pnpm", cwd })).rejects.toThrow("publicHoistPattern");
});

// YAML として壊れているファイルは、パスと yaml のエラー内容を添えて落とす。
test("throws with the file path when pnpm-workspace.yaml cannot be parsed", async () => {
  const { cwd } = createProject();
  writeFileSync(path.join(cwd, "pnpm-workspace.yaml"), 'publicHoistPattern: ["@types/*"\n');

  await expect(init({ agent: "pnpm", cwd })).rejects.toThrow(path.join(cwd, "pnpm-workspace.yaml"));
});

// 壊れたファイルは書き換えず、そのまま残す。
test("leaves an unparsable pnpm-workspace.yaml untouched", async () => {
  const { cwd } = createProject();
  const broken = 'publicHoistPattern: ["@types/*"\n';
  writeFileSync(path.join(cwd, "pnpm-workspace.yaml"), broken);

  await expect(init({ agent: "pnpm", cwd })).rejects.toThrow("Failed to parse");

  expect(readWorkspaceYaml(cwd)).toBe(broken);
});

// npm には publicHoistPattern の概念が無いので何も作らない。
test("does not create pnpm-workspace.yaml for npm", async () => {
  const { cwd } = createProject();

  await init({ agent: "npm", cwd });

  expect(existsSync(path.join(cwd, "pnpm-workspace.yaml"))).toBe(false);
});

// bun も同様に何も作らない。
test("does not create pnpm-workspace.yaml for bun", async () => {
  const { cwd } = createProject();

  await init({ agent: "bun", cwd });

  expect(existsSync(path.join(cwd, "pnpm-workspace.yaml"))).toBe(false);
});
