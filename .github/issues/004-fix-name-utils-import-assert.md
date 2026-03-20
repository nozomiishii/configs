# utils/name.ts の import assert を import with に移行

## 概要

`packages/eslint-config/utils/name.ts` で `import ... assert { type: 'json' }` を使用しているが、`assert` は非推奨となり `with` に置き換えられている。

## 該当箇所

- `packages/eslint-config/utils/name.ts:1` - `import pkg from '../package.json' assert { type: 'json' };`

## 参考

- [TC39 Import Attributes Proposal](https://github.com/tc39/proposal-import-attributes)

## 変更方針

`assert { type: 'json' }` → `with { type: 'json' }` に変更
