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
import { isScalar, isSeq, parseDocument } from "yaml";

export interface InitOptions {
  /**
   * package-manager-detector の AgentName。pnpm のときだけ publicHoistPattern を書く。
   */
  agent?: string;
  cwd: string;
  monorepo?: boolean;
  preset?: PresetId;
}

export interface InitResult {
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

const hoistKey = "publicHoistPattern";
const hoistPattern = "@nozomiishii/*";
const workspaceFileName = "pnpm-workspace.yaml";

export async function init({ agent, cwd, monorepo, preset }: InitOptions): Promise<InitResult> {
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

  // 設定ファイル・scripts・peer の書き込みは子に任せ、自分の名前だけ書かせない。
  await initCommitlint({ cwd, shouldAddSelfDependency: false });
  await initEslint({
    cwd,
    shouldAddSelfDependency: false,
    ...(monorepo !== undefined && { monorepo }),
    ...(preset !== undefined && { preset }),
  });
  await initLefthook({ cwd, shouldAddSelfDependency: false });
  await initOxfmt({ cwd, shouldAddSelfDependency: false });
  await initPostinstall({ cwd, shouldAddSelfDependency: false });

  if (isPnpm(agent)) {
    await addPublicHoistPattern(cwd);
  }

  return { removedDependencies };
}

/**
 * 子パッケージの bin と lefthook の hooks は推移依存になるため、pnpm では hoist しないと利用先から辿れない。
 */
async function addPublicHoistPattern(cwd: string): Promise<void> {
  const filePath = findWorkspaceFile(cwd) ?? path.resolve(cwd, workspaceFileName);
  const raw = existsSync(filePath) ? await readFile(filePath, "utf-8") : "";

  // コメントと既存キーを残すため、JS の値ではなく Document を編集する。
  const doc = parseDocument(raw);
  const [parseError] = doc.errors;

  if (parseError !== undefined) {
    throw new Error(`Failed to parse ${filePath}: ${parseError.message}`);
  }

  const patterns = doc.get(hoistKey);

  if (patterns === undefined || patterns === null) {
    doc.set(hoistKey, [hoistPattern]);
  } else if (isSeq(patterns)) {
    const isHas = patterns.items.some(
      (item) => (isScalar(item) ? item.value : item) === hoistPattern,
    );

    if (!isHas) {
      patterns.add(hoistPattern);
    }
  } else {
    throw new Error(
      `${hoistKey} in ${filePath} is not a list. Add "${hoistPattern}" to it manually.`,
    );
  }

  await writeFile(filePath, doc.toString());
}

/**
 * cwd から上に向かって最初に見つかる pnpm-workspace.yaml を返す。monorepo の package から実行されても
 * 設定は workspace root の 1 ファイルにしか効かない。
 * repo の外にある無関係なファイルを書き換えないよう、`.git` のあるディレクトリで探索を打ち切る。
 */
function findWorkspaceFile(cwd: string): string | undefined {
  let dir = path.resolve(cwd);

  for (;;) {
    const candidate = path.join(dir, workspaceFileName);

    if (existsSync(candidate)) {
      return candidate;
    }

    // worktree の `.git` はファイルなので、ディレクトリかどうかは見ない。
    if (existsSync(path.join(dir, ".git"))) {
      return undefined;
    }

    const parent = path.dirname(dir);

    if (parent === dir) {
      return undefined;
    }

    dir = parent;
  }
}

/**
 * AgentName は pnpm 6 系を `pnpm@6` として返すため、`@` の前で判定する。
 */
function isPnpm(agent: string | undefined): boolean {
  return agent?.split("@", 1)[0] === "pnpm";
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
