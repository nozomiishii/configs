# eslint.config.ts にコメントアウトされた jsdoc() / packageJson() が残っている

## 概要

`packages/eslint-config/eslint.config.ts` の末尾（L89-90）に、コメントアウトされた `jsdoc()` と `packageJson()` の呼び出しが残っている。
L67 で `jsdoc()` は既に有効化されているため、L89 のコメントは不要なデッドコード。

## 該当箇所

- `packages/eslint-config/eslint.config.ts:89` - `// jsdoc()`
- `packages/eslint-config/eslint.config.ts:90` - `// packageJson()`

## 変更方針

- L89 の `// jsdoc()` を削除（既に L67 で呼び出し済み）
- L90 の `// packageJson()` は TODO.md に記載済みのため削除
