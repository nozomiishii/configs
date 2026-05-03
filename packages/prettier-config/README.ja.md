# @nozomiishii/prettier-config

[English](./README.md) | 日本語

共通の [Prettier](https://prettier.io) 設定。

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/3o6Zt9ADoZ9grTGu1a/giphy.gif" alt="Coding" width="480" />
</div>
<div align="right">
  <p style="font-size: 0.75em; color: #656D76;">via South Park on GIPHY</p>
</div>
<br>

## インストール

[`nozo`](../nozo) CLI を使う:

```bash
pnpx nozo init
```

これで `@nozomiishii/prettier-config` / `prettier` が pin で `devDependencies` に追加され、`"type": "module"` が設定され、`format` / `format:fix` / `prettier` の scripts が追加され、shared config を re-export する `prettier.config.ts` が生成される。

## 同梱プラグイン

- [prettier-plugin-packagejson](https://www.npmjs.com/package/prettier-plugin-packagejson)
