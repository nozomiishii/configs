# @nozomiishii/commitlint-config

[English](./README.md) | 日本語

共通の [commitlint](https://commitlint.js.org) 設定。

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/487L0pNZKONFN01oHO/giphy.gif" alt="Coding" width="480" />
</div>
<div align="right">
  <small>via Locaweb on GIPHY</small>
</div>
<br>

## インストール

```bash
pnpm add -D @nozomiishii/commitlint-config
```

## 使い方

このパッケージを extend する `commitlint.config.ts`（もしくは `.js`）を追加します:

```ts
import config from '@nozomiishii/commitlint-config';

export default config;
```

このパッケージは pin された `@commitlint/cli` をラップする `nozo-commitlint` という namespace 付きの bin も同梱しています。Lefthook の設定（例: `@nozomiishii/lefthook-config`）からはこの shim を直接呼び出します:

```yaml
commit-msg:
  jobs:
    - name: commitlint
      run: node_modules/.bin/nozo-commitlint --edit {1} --verbose
```
