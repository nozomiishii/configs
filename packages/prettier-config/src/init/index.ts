/** Scaffold Prettier config into the consumer project. */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type PackageJson = {
  devDependencies?: Record<string, string>;
  name: string;
  peerDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  type?: string;
  version: string;
};

export type InitOptions = { cwd: string };

export async function init({ cwd }: InitOptions): Promise<void> {
  const selfPkgPath = fileURLToPath(new URL("../../package.json", import.meta.url));
  const selfPkg = JSON.parse(readFileSync(selfPkgPath, "utf8")) as PackageJson & {
    peerDependencies: { prettier: string };
  };

  const starterPath = fileURLToPath(new URL("../../starter.ts", import.meta.url));
  const starter = readFileSync(starterPath, "utf8");

  const targetPath = path.resolve(cwd, "package.json");
  const target = JSON.parse(readFileSync(targetPath, "utf8")) as PackageJson;

  target.type = "module";

  target.devDependencies = {
    ...target.devDependencies,
    prettier: selfPkg.peerDependencies.prettier,
    [selfPkg.name]: selfPkg.version,
  };

  target.scripts = {
    ...target.scripts,
    "format": "pnpm prettier . --check",
    "format:fix": "pnpm prettier . --write",
    "prettier": "prettier --ignore-unknown",
  };

  writeFileSync(targetPath, `${JSON.stringify(target, null, 2)}\n`);
  writeFileSync(path.resolve(cwd, "prettier.config.ts"), starter);
}
