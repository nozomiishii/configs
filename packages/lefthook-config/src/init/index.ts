/**
 * Scaffold lefthook config into the consumer project.
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
   * starter が extends するパッケージ。既定は自パッケージ名。
   * configs メタパッケージ経由の導入では meta の名前を渡す。
   */
  specifier?: string;
}

interface PackageJson {
  devDependencies?: Record<string, string>;
  name: string;
  peerDependencies?: Record<string, string>;
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
    peerDependencies: { lefthook: string };
  };

  const starterRaw = await readFile(path.join(root, "starter.yaml"), "utf-8");

  // extends は node の解決を通らないので、パッケージ名の部分だけを差し替える。
  const starterSpecifier = specifier ?? selfPkg.name;
  const starter = starterRaw.replaceAll(selfPkg.name, () => starterSpecifier);

  const targetPath = path.resolve(cwd, "package.json");
  const target = JSON.parse(await readFile(targetPath, "utf-8")) as PackageJson;

  const selfDependency = shouldAddSelfDependency ? { [selfPkg.name]: selfPkg.version } : {};

  target.devDependencies = {
    ...target.devDependencies,
    lefthook: selfPkg.peerDependencies.lefthook,
    ...selfDependency,
  };

  await writeFile(targetPath, `${JSON.stringify(target, null, 2)}\n`);
  await writeFile(path.resolve(cwd, "lefthook.yaml"), starter);
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
