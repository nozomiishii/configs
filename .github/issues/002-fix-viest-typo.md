# ファイル名 viest.ts の typo（正: vitest.ts）

## 概要

`packages/eslint-config/rules/viest.ts` のファイル名が `vitest` の typo になっている。
関数名・name文字列・インポートパスすべてに波及している。

## 該当箇所

- `packages/eslint-config/rules/viest.ts` - ファイル名
- `packages/eslint-config/rules/viest.ts:10` - `export function viest()`
- `packages/eslint-config/rules/viest.ts:16` - `name: name('viest')`
- `packages/eslint-config/eslint.config.ts:24` - `import { viest } from './rules/viest'`
- `packages/eslint-config/eslint.config.ts:81` - `viest()`

## 変更方針

1. ファイル名を `viest.ts` → `vitest.ts` にリネーム
2. 関数名を `viest()` → `vitest()` にリネーム
3. name文字列を `'viest'` → `'vitest'` に修正
4. `eslint.config.ts` のインポートパスと呼び出しを更新
