# jsonc.ts の関数名が `perfectionist()` になっている

## 概要

`packages/eslint-config/rules/jsonc.ts` でエクスポートされている関数名が `perfectionist()` になっており、ファイル名・用途と一致していない。
コピペミスと思われる。また、このファイルは `eslint.config.ts` からインポートされておらず、実質的に未使用。

## 該当箇所

- `packages/eslint-config/rules/jsonc.ts:14` - `export function perfectionist()`
- `packages/eslint-config/eslint.config.ts` - jsonc からのインポートが存在しない

## 付随する問題

- **L1**: コメントアウトされた import 先が `eslint-plugin-jsdoc`（正しくは `eslint-plugin-jsonc`）
- **L17**: コメント内の変数名が `slintPluginJsonc`（`eslintPluginJsonc` のtypo）
- **L20-27**: コメントアウトされたルール設定が残っている

## 変更方針

1. 関数名を `perfectionist()` → `jsonc()` にリネーム
2. L1 のコメントアウトされた import を正しいプラグイン名に修正するか削除
3. L17 のtypoを修正するか、コメントアウトされたコードごと削除
4. L20-27 のコメントアウトされたルールを削除（必要なら TODO に移動）
5. `eslint.config.ts` に `jsonc()` のインポートと呼び出しを追加
