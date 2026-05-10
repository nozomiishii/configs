/** Scaffold ESLint config into the consumer project. */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type InitOptions = { cwd: string };

type PackageJson = {
  devDependencies?: Record<string, string>;
  name: string;
  peerDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  version: string;
};

export async function init({ cwd }: InitOptions): Promise<void> {
  const selfPkgPath = fileURLToPath(new URL("../../package.json", import.meta.url));
  const selfPkg = JSON.parse(await readFile(selfPkgPath, "utf8")) as PackageJson & {
    peerDependencies: { eslint: string; typescript: string };
  };

  const starterPath = fileURLToPath(new URL("../../starter.ts", import.meta.url));
  const starter = await readFile(starterPath, "utf8");

  const targetPath = path.resolve(cwd, "package.json");
  const target = JSON.parse(await readFile(targetPath, "utf8")) as PackageJson;

  target.devDependencies = {
    ...target.devDependencies,
    eslint: selfPkg.peerDependencies.eslint,
    [selfPkg.name]: selfPkg.version,
    typescript: selfPkg.peerDependencies.typescript,
  };

  target.scripts = {
    ...target.scripts,
    "eslint": "eslint --max-warnings=0 --cache",
    "lint": "pnpm eslint",
    "lint:fix": "pnpm eslint --fix",
  };

  await writeFile(targetPath, `${JSON.stringify(target, null, 2)}\n`);
  await writeFile(path.resolve(cwd, "eslint.config.ts"), starter);
}
