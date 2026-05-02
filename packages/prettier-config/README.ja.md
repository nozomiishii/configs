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

統一 CLI [`nozo`](../nozo) を使う:

```bash
pnpx nozo init
```

または本パッケージの init bin を直接実行:

```bash
pnpx -p @nozomiishii/prettier-config nozo-prettier-init
```

どちらの経路でも、`@nozomiishii/prettier-config` / `prettier` が pin で `devDependencies` に追加され、`"type": "module"` が設定され、`format` / `format:fix` / `prettier` の scripts が追加され、shared config を re-export する `prettier.config.ts` が生成される。

## 手動セットアップ

```bash
pnpm add -D @nozomiishii/prettier-config prettier
```

scripts の設定:

```bash
npm pkg set type="module"
npm pkg set scripts.format="pnpm prettier . --check"
npm pkg set scripts.format:fix="pnpm prettier . --write"
npm pkg set scripts.prettier="prettier --ignore-unknown"
```

`package.json`

```json
{
  "type": "module",
  "scripts": {
    "format": "pnpm prettier . --check",
    "format:fix": "pnpm prettier . --write",
    "prettier": "prettier --ignore-unknown"
  }
}
```

`prettier.config.ts`

```ts
export { default } from "@nozomiishii/prettier-config";
```

## 同梱プラグイン

- [prettier-plugin-packagejson](https://www.npmjs.com/package/prettier-plugin-packagejson)
