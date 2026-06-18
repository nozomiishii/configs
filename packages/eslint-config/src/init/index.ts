/** Scaffold ESLint config into the consumer project. */
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type InitOptions = { cwd: string; monorepo?: boolean; preset?: PresetId };

export type PresetId = "nextjs" | "node";

type PackageJson = {
  devDependencies?: Record<string, string>;
  name: string;
  peerDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  version: string;
};

export async function init({
  cwd,
  monorepo = false,
  preset = "nextjs",
}: InitOptions): Promise<void> {
  const root = packageRoot();

  const selfPkg = JSON.parse(
    await readFile(path.join(root, "package.json"), "utf8"),
  ) as PackageJson & {
    peerDependencies: { eslint: string; typescript: string };
  };

  const starterRaw = await readFile(
    path.join(root, "starters", `${preset}.ts`),
    "utf8",
  );

  // monorepo の per-package config は tsconfigRootDir を明示する。
  const starter = monorepo
    ? starterRaw.replace(
        `${preset}()`,
        () => `${preset}({ typescript: { tsconfigRootDir: import.meta.dirname } })`,
      )
    : starterRaw;

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
