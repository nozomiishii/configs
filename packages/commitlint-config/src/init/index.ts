/** Scaffold commitlint config into the consumer project. */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type PackageJson = {
  devDependencies?: Record<string, string>;
  name: string;
  version: string;
};

export type InitOptions = { cwd: string };

export async function init({ cwd }: InitOptions): Promise<void> {
  const selfPkgPath = fileURLToPath(new URL("../../package.json", import.meta.url));
  const selfPkg = JSON.parse(readFileSync(selfPkgPath, "utf8")) as PackageJson;

  const starterPath = fileURLToPath(new URL("../../starter.ts", import.meta.url));
  const starter = readFileSync(starterPath, "utf8");

  const targetPath = path.resolve(cwd, "package.json");
  const target = JSON.parse(readFileSync(targetPath, "utf8")) as PackageJson;

  target.devDependencies = {
    ...target.devDependencies,
    [selfPkg.name]: selfPkg.version,
  };

  writeFileSync(targetPath, `${JSON.stringify(target, null, 2)}\n`);
  writeFileSync(path.resolve(cwd, "commitlint.config.ts"), starter);
}
