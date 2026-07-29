/** Scaffold ESLint config into the consumer project. */
import { type AST, getStaticJSONValue, parseJSON } from "jsonc-eslint-parser";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type InitOptions = { cwd: string; monorepo?: boolean; preset?: PresetId };

export type InitResult = { tsconfigInclude: TsconfigIncludeOutcome };

export type PresetId = "nextjs" | "node";

export type TsconfigIncludeOutcome = "added" | "invalid" | "missing" | "no-include" | "unchanged";

type PackageJson = {
  devDependencies?: Record<string, string>;
  name: string;
  peerDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  version: string;
};

/**
 * TypeScript はディレクトリ名を展開するときドット始まりを拾わないため、
 * `.storybook` ではなく glob で書かないと projectService の対象にならない。
 */
const STORYBOOK_INCLUDE = ".storybook/**/*";

/** tsconfig.json をどう扱ったかを CLI に伝える文言。nozo と nozo-eslint-init で共有する。 */
export const tsconfigIncludeReports = {
  added: {
    level: "info",
    message: `tsconfig.json: added "${STORYBOOK_INCLUDE}" to include`,
  },
  invalid: {
    level: "warn",
    message: `tsconfig.json could not be parsed; add "${STORYBOOK_INCLUDE}" to include by hand`,
  },
  missing: {
    level: "info",
    message: `No tsconfig.json found; skipped the "${STORYBOOK_INCLUDE}" include`,
  },
  "no-include": {
    level: "warn",
    message: `tsconfig.json has no include array; add "${STORYBOOK_INCLUDE}" to it by hand`,
  },
  unchanged: {
    level: "info",
    message: `tsconfig.json: include already covers "${STORYBOOK_INCLUDE}"`,
  },
} as const satisfies Record<TsconfigIncludeOutcome, { level: "info" | "warn"; message: string }>;

export async function init({
  cwd,
  monorepo = false,
  preset = "nextjs",
}: InitOptions): Promise<InitResult> {
  const root = packageRoot();

  const selfPkg = JSON.parse(
    await readFile(path.join(root, "package.json"), "utf8"),
  ) as PackageJson & {
    peerDependencies: { eslint: string; typescript: string };
  };

  const starterRaw = await readFile(path.join(root, "starters", `${preset}.ts`), "utf8");

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
    eslint: "eslint --max-warnings=0 --cache",
    lint: "pnpm eslint",
    "lint:fix": "pnpm eslint --fix",
  };

  await writeFile(targetPath, `${JSON.stringify(target, null, 2)}\n`);
  await writeFile(path.resolve(cwd, "eslint.config.ts"), starter);

  return { tsconfigInclude: await ensureStorybookInclude(cwd) };
}

/**
 * preset は `.storybook` を lint するため、tsconfig.json の include にも glob を足す。
 * include が無い tsconfig は既定の `**\/*` を壊さないよう触らない。
 */
async function ensureStorybookInclude(cwd: string): Promise<TsconfigIncludeOutcome> {
  const tsconfigPath = path.resolve(cwd, "tsconfig.json");

  if (!existsSync(tsconfigPath)) {
    return "missing";
  }

  const source = await readFile(tsconfigPath, "utf8");
  let include: AST.JSONArrayExpression | null;

  try {
    include = findIncludeArray(source);
  } catch {
    return "invalid";
  }

  if (include === null) {
    return "no-include";
  }

  if (getStaticJSONValue(include).includes(STORYBOOK_INCLUDE)) {
    return "unchanged";
  }

  await writeFile(tsconfigPath, insertInclude(source, include));

  return "added";
}

/** tsconfig.json の include 配列を返す。include が無い、または配列でないときは null。 */
function findIncludeArray(source: string): AST.JSONArrayExpression | null {
  const root = parseJSON(source, { jsonSyntax: "jsonc" }).body[0].expression;

  if (root.type !== "JSONObjectExpression") {
    return null;
  }

  const include = root.properties.find(
    (property) => property.key.type === "JSONLiteral" && property.key.value === "include",
  );

  return include?.value.type === "JSONArrayExpression" ? include.value : null;
}

/** offset がある行の字下げ。 */
function indentOf(source: string, offset: number): string {
  const lineStart = source.lastIndexOf("\n", offset) + 1;

  return /^[\t ]*/.exec(source.slice(lineStart, offset))?.[0] ?? "";
}

/** コメントや書式を保つため、JSON を組み直さずテキストへ直接差し込む。 */
function insertInclude(source: string, include: AST.JSONArrayExpression): string {
  const entry = JSON.stringify(STORYBOOK_INCLUDE);
  const last = include.elements.at(-1);

  if (last === undefined || last === null) {
    const afterBracket = include.range[0] + 1;

    return `${source.slice(0, afterBracket)}${entry}${source.slice(afterBracket)}`;
  }

  const end = last.range[1];
  const isMultiline = source.slice(include.range[0], end).includes("\n");
  const separator = isMultiline ? `,\n${indentOf(source, last.range[0])}` : ", ";

  return `${source.slice(0, end)}${separator}${entry}${source.slice(end)}`;
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
