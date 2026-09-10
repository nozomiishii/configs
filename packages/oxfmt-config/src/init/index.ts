/**
 * Scaffold oxfmt config into the consumer project.
 */
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface InitOptions {
  cwd: string;
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

interface PackageJson {
  devDependencies?: Record<string, string>;
  name: string;
  peerDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  type?: string;
  version: string;
}

export async function init({
  cwd,
  shouldAddSelfDependency = true,
  specifier,
}: InitOptions): Promise<void> {
  const root = packageRoot();

  const selfPkg = JSON.parse(
    await readFile(path.join(root, "package.json"), "utf-8"),
  ) as PackageJson & {
    peerDependencies: { oxfmt: string };
  };

  const starterRaw = await readFile(path.join(root, "starter.ts"), "utf-8");
  const starter = rewriteStarter(starterRaw, selfPkg.name, specifier ?? selfPkg.name);

  const targetPath = path.resolve(cwd, "package.json");
  const target = JSON.parse(await readFile(targetPath, "utf-8")) as PackageJson;

  target.type = "module";

  const selfDependency = shouldAddSelfDependency ? { [selfPkg.name]: selfPkg.version } : {};

  target.devDependencies = {
    ...target.devDependencies,
    oxfmt: selfPkg.peerDependencies.oxfmt,
    ...selfDependency,
  };

  target.scripts = {
    ...target.scripts,
    format: "pnpm oxfmt . --check",
    "format:fix": "pnpm oxfmt .",
    oxfmt: "oxfmt --no-error-on-unmatched-pattern",
  };

  await writeFile(targetPath, `${JSON.stringify(target, null, 2)}\n`);
  await writeFile(path.resolve(cwd, "oxfmt.config.ts"), starter);
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
 * starter の参照先を specifier に差し替える。@see の repo リンクも specifier のパッケージへ向ける。
 */
function rewriteStarter(starter: string, selfName: string, specifier: string): string {
  return starter
    .replaceAll(selfName, () => specifier)
    .replaceAll(
      `tree/main/packages/${packageDirectory(selfName)}`,
      () => `tree/main/packages/${packageDirectory(specifier)}`,
    );
}
