/**
 * Scaffold ESLint config into the consumer project.
 */
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface InitOptions {
  cwd: string;
  monorepo?: boolean;
  preset?: PresetId;
  /**
   * false のとき自パッケージ名を利用先の devDependencies に書かない。
   * configs メタパッケージ経由の導入で使う。
   */
  shouldAddSelfDependency?: boolean;
  /**
   * starter が参照するパッケージ。既定は自パッケージ名。
   * configs メタパッケージ経由の導入では meta のサブパスを渡す。
   */
  specifier?: string;
}

export type PresetId = "nextjs" | "node" | "tanstack-start";

/**
 * starter が呼ぶ preset 関数名。ファイル名は kebab-case、関数は camelCase のため対応表で持つ。
 */
const presetFunctions: Record<PresetId, string> = {
  nextjs: "nextjs",
  node: "node",
  "tanstack-start": "tanstackStart",
};

interface PackageJson {
  devDependencies?: Record<string, string>;
  name: string;
  peerDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  version: string;
}

export async function init({
  cwd,
  monorepo = false,
  preset = "nextjs",
  shouldAddSelfDependency = true,
  specifier,
}: InitOptions): Promise<void> {
  const root = packageRoot();

  const selfPkg = JSON.parse(
    await readFile(path.join(root, "package.json"), "utf-8"),
  ) as PackageJson & {
    peerDependencies: { eslint: string; typescript: string };
  };

  const starterFile = await readFile(path.join(root, "starters", `${preset}.ts`), "utf-8");
  const starterRaw = rewriteStarter(starterFile, selfPkg.name, specifier ?? selfPkg.name);

  // monorepo の per-package config は tsconfigRootDir を明示する。
  const presetFunction = presetFunctions[preset];
  const starter = monorepo
    ? starterRaw.replace(
        `${presetFunction}()`,
        () => `${presetFunction}({ typescript: { tsconfigRootDir: import.meta.dirname } })`,
      )
    : starterRaw;

  const targetPath = path.resolve(cwd, "package.json");
  const target = JSON.parse(await readFile(targetPath, "utf-8")) as PackageJson;

  const selfDependency = shouldAddSelfDependency ? { [selfPkg.name]: selfPkg.version } : {};

  target.devDependencies = {
    ...target.devDependencies,
    eslint: selfPkg.peerDependencies.eslint,
    ...selfDependency,
    typescript: selfPkg.peerDependencies.typescript,
  };

  target.scripts = {
    ...target.scripts,
    eslint: "eslint --max-warnings=0 --cache",
    lint: "pnpm eslint",
    "lint:fix": "pnpm eslint --fix",
  };

  await writeFile(targetPath, `${JSON.stringify(target, null, 2)}\n`);
  await writeFile(path.resolve(cwd, "eslint.config.ts"), starter);
}

/**
 * npm 名から repo の packages/ 配下のディレクトリ名を取り出す。サブパスは読み飛ばす。
 */
function packageDirectory(specifier: string): string {
  return specifier.split("/", 2)[1] ?? specifier;
}

/**
 * bundle後のチャンク位置に依存せず、package.jsonのあるパッケージルートを探す。
 * tsdownはinitを `dist/init-<hash>.js` へホイストするため `../../` が固定で使えない。
 */
function packageRoot(): string {
  let dir = path.dirname(fileURLToPath(import.meta.url));

  while (!existsSync(path.join(dir, "package.json"))) {
    const parent = path.dirname(dir);

    if (parent === dir) {
      throw new Error("package.json not found");
    }

    dir = parent;
  }

  return dir;
}

/**
 * starter の import 元を specifier に差し替える。@see の repo リンクも specifier のパッケージへ向ける。
 * troubleshooting の blob リンクは eslint-config の文書を指したままにする。
 */
function rewriteStarter(starter: string, selfName: string, specifier: string): string {
  return starter
    .replaceAll(selfName, () => specifier)
    .replaceAll(
      `tree/main/packages/${packageDirectory(selfName)}`,
      () => `tree/main/packages/${packageDirectory(specifier)}`,
    );
}
