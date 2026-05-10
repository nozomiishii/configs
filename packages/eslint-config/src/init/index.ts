/** Scaffold ESLint config into the consumer project. */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type PackageJson = {
  devDependencies?: Record<string, string>;
  name: string;
  peerDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  version: string;
};

export type InitOptions = { cwd: string };

export async function init({ cwd }: InitOptions): Promise<void> {
  const selfPkgPath = fileURLToPath(new URL("../../package.json", import.meta.url));
  const selfPkg = JSON.parse(readFileSync(selfPkgPath, "utf8")) as PackageJson & {
    peerDependencies: { eslint: string; typescript: string };
  };

  const starterPath = fileURLToPath(new URL("../../starter.ts", import.meta.url));
  const starter = readFileSync(starterPath, "utf8");

  const targetPath = path.resolve(cwd, "package.json");
  const target = JSON.parse(readFileSync(targetPath, "utf8")) as PackageJson;

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

  writeFileSync(targetPath, `${JSON.stringify(target, null, 2)}\n`);
  writeFileSync(path.resolve(cwd, "eslint.config.ts"), starter);
}
