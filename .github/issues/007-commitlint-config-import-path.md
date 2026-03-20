# commitlint.config.ts のインポートパスを改善

## 概要

`commitlint.config.ts` で `extends: ['./packages/commitlint-config/index']` と相対パスで参照している。
コメントアウトされた `@nozomiishii/commitlint-config` からの参照が本来の形。

## 該当箇所

- `commitlint.config.ts:1-2`
  ```typescript
  // export default { extends: ['@nozomiishii/commitlint-config'] };
  export default { extends: ['./packages/commitlint-config/index'] };
  ```

## 変更方針

monorepo 内でパッケージ名参照が動作するよう workspace 設定を確認し、`@nozomiishii/commitlint-config` に戻す。
動作しない場合はコメントで理由を明記する。
