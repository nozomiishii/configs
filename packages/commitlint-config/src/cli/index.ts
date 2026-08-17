import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const selfPackageName = "@nozomiishii/commitlint-config";

// 共有設定の適用を求める自前の flag。commitlint には渡さず、ここで消費する。
const recommendedFlag = "--recommended";

/**
 * commitlint に渡す引数を組み立てる。
 *
 * `--recommended` を渡されたときだけ、その位置で `--config <絶対パス>` に置き換える。
 * flag が無ければ argv を素通しし、`nozo-commitlint` は `@commitlint/cli` の
 * pass-through のままになる。repo 側の `commitlint.config.*` も、そこで上書きした rule も
 * これまで通り効く。
 *
 * `--extends` ではなく `--config` を使うのは、`--extends` が additive にならないから。
 * `@commitlint/load` は CLI の値を `merge(base, fileConfig, seed)` で重ねるが、この `merge` は
 * 配列を index 単位でマージするため、repo 側 `extends[0]` を無言で置き換えてしまう。
 * `--config` は指定したファイルだけを load するので、その事故が起きない。
 *
 * 位置を保つのは、後ろに呼び出し側の `--config` があれば yargs の後勝ちでそちらを優先させるため。
 *
 * `resolveConfigPath` を関数で受けるのは、flag が無いときに解決を走らせないため。
 */
export function buildCommitlintArgs(
  argv: readonly string[],
  resolveConfigPath: () => string,
): string[] {
  const index = argv.indexOf(recommendedFlag);

  if (index === -1) {
    return [...argv];
  }

  return [...argv.slice(0, index), "--config", resolveConfigPath(), ...argv.slice(index + 1)];
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
