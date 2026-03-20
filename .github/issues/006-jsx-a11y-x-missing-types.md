# eslint-plugin-jsx-a11y-x の型定義が欠如している

## 概要

`packages/eslint-config/rules/jsx-a11y-x.ts` で `eslint-plugin-jsx-a11y-x` をインポートする際、型定義が存在しないため `@ts-expect-error` と `eslint-disable` で抑制している。

## 該当箇所

- `packages/eslint-config/rules/jsx-a11y-x.ts:1-2`
  ```typescript
  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  // @ts-expect-error missing types
  ```

## 変更方針

- upstream に型定義の PR を出す、または `@types` パッケージの公開を確認
- 短期的には `.d.ts` ファイルを作成してモジュール宣言を追加
