/**
 * Scaffold the recommended config bundle into the consumer project.
 */
import { init as initCommitlint } from "@nozomiishii/commitlint-config/init";
import { init as initEslint, type PresetId } from "@nozomiishii/eslint-config/init";
import { init as initLefthook } from "@nozomiishii/lefthook-config/init";
import { init as initOxfmt } from "@nozomiishii/oxfmt-config/init";
import { init as initPostinstall } from "@nozomiishii/postinstall/init";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface InitOptions {
  cwd: string;
  monorepo?: boolean;
  preset?: PresetId;
}

export interface InitResult {
  /**
   * 利用先に伝える注意書き。呼び出し元がそのまま表示する。
   */
  notes: string[];
  /**
   * configs に置き換えたので devDependencies から消した子パッケージ名。
   */
  removedDependencies: string[];
}

interface PackageJson {
  devDependencies?: Record<string, string>;
  name: string;
  version: string;
}

/**
 * configs が束ねる子パッケージ。利用先は configs だけを直接依存にする。
 */
const bundledPackages = [
  "@nozomiishii/commitlint-config",
  "@nozomiishii/eslint-config",
  "@nozomiishii/lefthook-config",
  "@nozomiishii/oxfmt-config",
  "@nozomiishii/postinstall",
  "@nozomiishii/tsconfig",
];

/**
 * 直接依存を消したとき、および monorepo を指定したときに出す注意書き。monorepo の sub-package に
 * 残った古い版が configs 経由の版と併存すると、ESLint の plugin が二重に登録される。
 * ルートから消せる依存が無くても sub-package には残り得るので、monorepo なら常に出す。
 */
const subPackageNote =
  "Sub-packages in a monorepo may still list the removed packages. Remove them there too: two versions of the same package register the ESLint plugins twice.";

export async function init({ cwd, monorepo, preset }: InitOptions): Promise<InitResult> {
  const root = packageRoot();
  const selfPkg = JSON.parse(
    await readFile(path.join(root, "package.json"), "utf-8"),
  ) as PackageJson;

  const targetPath = path.resolve(cwd, "package.json");
  const target = JSON.parse(await readFile(targetPath, "utf-8")) as PackageJson;

  const existing = target.devDependencies ?? {};
  const removedDependencies = bundledPackages.filter((name) => Object.hasOwn(existing, name));
  const kept = Object.entries(existing).filter(([name]) => !removedDependencies.includes(name));

  target.devDependencies = {
    ...Object.fromEntries(kept),
    [selfPkg.name]: selfPkg.version,
  };

  await writeFile(targetPath, `${JSON.stringify(target, null, 2)}\n`);

  // 設定ファイル・scripts・peer の書き込みは子に任せ、参照先だけ configs のサブパスに向けさせる。
  await initCommitlint({
    cwd,
    shouldAddSelfDependency: false,
    specifier: `${selfPkg.name}/commitlint`,
  });
  await initEslint({
    cwd,
    shouldAddSelfDependency: false,
    specifier: `${selfPkg.name}/eslint`,
    ...(monorepo !== undefined && { monorepo }),
    ...(preset !== undefined && { preset }),
  });
  // lefthook の extends は node の解決を通らないので、サブパスではなくパッケージ名を渡す。
  await initLefthook({ cwd, shouldAddSelfDependency: false, specifier: selfPkg.name });
  await initOxfmt({ cwd, shouldAddSelfDependency: false, specifier: `${selfPkg.name}/oxfmt` });
  await initPostinstall({ cwd, shouldAddSelfDependency: false });

  const shouldNote = removedDependencies.length > 0 || monorepo === true;

  return {
    notes: shouldNote ? [subPackageNote] : [],
    removedDependencies,
  };
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
