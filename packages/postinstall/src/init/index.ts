/** Scaffold the postinstall hook into the consumer project. */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type PackageJson = {
  devDependencies?: Record<string, string>;
  name: string;
  scripts?: Record<string, string>;
  version: string;
};

export type InitOptions = { cwd: string };

export async function init({ cwd }: InitOptions): Promise<void> {
  const selfPkgPath = fileURLToPath(new URL("../../package.json", import.meta.url));
  const selfPkg = JSON.parse(readFileSync(selfPkgPath, "utf8")) as PackageJson;

  const targetPath = path.resolve(cwd, "package.json");
  const target = JSON.parse(readFileSync(targetPath, "utf8")) as PackageJson;

  target.devDependencies = {
    ...target.devDependencies,
    [selfPkg.name]: selfPkg.version,
  };

  target.scripts = {
    ...target.scripts,
    postinstall: "postinstall",
  };

  writeFileSync(targetPath, `${JSON.stringify(target, null, 2)}\n`);
}
