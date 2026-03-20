# apps/nozo/typescript/package.json の repository.directory が間違っている

## 概要

`apps/nozo/typescript/package.json` の `repository.directory` フィールドが `apps/typescript/nozo` となっているが、実際のパスは `apps/nozo/typescript`。

## 該当箇所

- `apps/nozo/typescript/package.json:11` - `"directory": "apps/typescript/nozo"`

## 変更方針

`"directory": "apps/typescript/nozo"` → `"directory": "apps/nozo/typescript"` に修正
