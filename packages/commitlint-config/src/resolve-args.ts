import { createRequire } from "node:module";

/**
 * 常に同梱 config を明示指定して commitlint を実行するための引数を組み立てる。
 *
 * cwd の config 探索に任せると、プロジェクトに config が無いとき cosmiconfig が
 * 親ディレクトリ〜home まで遡り、extends 解決も npm -g へ fallback するため、
 * 古い config / ルールが適用される事故につながる。明示 `--config` を渡すと
 * commitlint は探索を一切行わず、この事故経路を遮断できる。
 * `-g` / `--config` の明示指定のみ上書きを許す。
 */
export function resolveArgs(args: readonly string[]): readonly string[] {
  const hasExplicitConfig = args.some(
    (arg) =>
      arg === "-g" || arg === "--config" || arg.startsWith("-g=") || arg.startsWith("--config="),
  );

  if (hasExplicitConfig) {
    return args;
  }

  return [
    ...args,
    "--config",
    createRequire(import.meta.url).resolve("@nozomiishii/commitlint-config"),
  ];
}
