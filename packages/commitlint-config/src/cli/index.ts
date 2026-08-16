import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const selfPackageName = "@nozomiishii/commitlint-config";

// commitlint が設定を「選ぶ」flag。呼び出し側がこれを渡したときは自己設定を注入しない。
const configSelectingFlags = ["--config", "-g", "--extends", "-x"] as const;

/**
 * commitlint に渡す引数を組み立てる。
 *
 * `--config` ではなく `--extends` を使うのは additive だから。
 * repo 側の `commitlint.config.ts` は読まれ続け、そこで上書きした rule も勝つ。
 * 共有設定は「下敷き」として必ず載る、という関係になる。
 */
export function buildCommitlintArgs(argv: readonly string[], selfConfigPath: string): string[] {
  // 呼び出し側が設定を明示したときは尊重する。
  if (hasExplicitConfigFlag(argv)) {
    return [...argv];
  }

  // `=` 形式にして、後続の引数が extends の配列へ巻き込まれないようにする。
  return [`--extends=${selfConfigPath}`, ...argv];
}

/**
 * 呼び出し側が設定ファイルや extends を明示したか。
 */
export function hasExplicitConfigFlag(argv: readonly string[]): boolean {
  return argv.some((arg) =>
    configSelectingFlags.some((flag) => arg === flag || arg.startsWith(`${flag}=`)),
  );
}

export function resolveCommitlintCli(): string {
  return require.resolve("@commitlint/cli/cli.js");
}

/**
 * 自分の設定ファイルを絶対パスで解決する。
 *
 * commitlint の `extends: ["@nozomiishii/commitlint-config"]` は cwd を起点とした
 * Node の module 解決に乗る。package.json / node_modules を持たない repo では
 * この探索が空振りし、npx cache に残った無関係な版へ解決されることがある。
 * その版に custom rule が無くても commitlint は `found 0 problems` と報告するため、
 * 壊れていることに気づけない。
 *
 * 名前ではなく絶対パスを渡して、解決経路から cwd を外す。
 * パスは package.json の `exports` を使った self-reference で得るため、
 * bundle 後のチャンク位置に依存しない。
 */
export function resolveSelfConfigPath(): string {
  // 解決できないときは MODULE_NOT_FOUND で落ちる。
  // 設定なしの lint が静かに通るより、パッケージ名付きで失敗するほうがよい。
  return require.resolve(selfPackageName);
}
