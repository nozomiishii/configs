/** Scaffold the postinstall hook into the consumer project. */
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type InitOptions = { cwd: string };

type PackageJson = {
  devDependencies?: Record<string, string>;
  name: string;
  scripts?: Record<string, string>;
  version: string;
};

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

export async function init({ cwd }: InitOptions): Promise<void> {
  const root = packageRoot();

  const selfPkg = JSON.parse(
    await readFile(path.join(root, "package.json"), "utf8"),
  ) as PackageJson;

  const targetPath = path.resolve(cwd, "package.json");
  const target = JSON.parse(await readFile(targetPath, "utf8")) as PackageJson;

  target.devDependencies = {
    ...target.devDependencies,
    [selfPkg.name]: selfPkg.version,
  };

  target.scripts = {
    ...target.scripts,
    postinstall: "postinstall",
  };

  await writeFile(targetPath, `${JSON.stringify(target, null, 2)}\n`);
}
