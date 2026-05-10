/** Scaffold lefthook config into the consumer project. */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type InitOptions = { cwd: string };

type PackageJson = {
  devDependencies?: Record<string, string>;
  name: string;
  peerDependencies?: Record<string, string>;
  version: string;
};

export async function init({ cwd }: InitOptions): Promise<void> {
  const selfPkgPath = fileURLToPath(new URL("../../package.json", import.meta.url));
  const selfPkg = JSON.parse(await readFile(selfPkgPath, "utf8")) as PackageJson & {
    peerDependencies: { lefthook: string };
  };

  const starterPath = fileURLToPath(new URL("../../starter.yaml", import.meta.url));
  const starter = await readFile(starterPath, "utf8");

  const targetPath = path.resolve(cwd, "package.json");
  const target = JSON.parse(await readFile(targetPath, "utf8")) as PackageJson;

  target.devDependencies = {
    ...target.devDependencies,
    [selfPkg.name]: selfPkg.version,
    lefthook: selfPkg.peerDependencies.lefthook,
  };

  await writeFile(targetPath, `${JSON.stringify(target, null, 2)}\n`);
  await writeFile(path.resolve(cwd, "lefthook.yaml"), starter);
}
