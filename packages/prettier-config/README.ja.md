# @nozomiishii/prettier-config

[English](./README.md) | 日本語

Nozomi 推奨の [Prettier](https://prettier.io) 設定。

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/3o6Zt9ADoZ9grTGu1a/giphy.gif" alt="Coding" width="480" />
</div>
<div align="right">
  <p style="font-size: 0.75em; color: #656D76;">via South Park on GIPHY</p>
</div>
<br>

## 概要

- 忙しい人はとりあえず下のコマンド実行だけでオールオッケー

pnpm

```bash
pnpx @nozomiishii/prettier-config@latest
```

## インストール

```bash
pnpm add -D @nozomiishii/prettier-config
```

- `@nozomiishii/prettier-config` だけでいい。`prettier` を別途入れなくていい。

### 同梱プラグイン

- [prettier-plugin-packagejson](https://www.npmjs.com/package/prettier-plugin-packagejson)
  - `package.json` をいいかんじに並び替え

#### [オプション]

- [@prettier/plugin-ruby](https://www.npmjs.com/package/@prettier/plugin-ruby)
  - Brewfile など Ruby のファイルも format したい
  - プロジェクト内で Ruby が多い場合は、[rufo](https://github.com/ruby-formatter/rufo) のほうがいいかも
- [prettier-plugin-sh](https://www.npmjs.com/package/prettier-plugin-sh)
  - shell のファイルも format したい
  - プロジェクト内で shell が多い場合は、[shfmt](https://github.com/mvdan/sh) のほうがいいかも

```sh
pnpm add -D @prettier/plugin-ruby
```

## セットアップ

### `prettier.config.js` を作成

```bash
echo "export { default } from '@nozomiishii/prettier-config';" > prettier.config.js
```

## package.json 用スクリプト

```bash
npm pkg set type="module"
npm pkg set scripts.format="pnpm prettier --check"
npm pkg set scripts.format:fix="pnpm prettier --write"
npm pkg set scripts.prettier="prettier . --ignore-unknown"
```

`package.json`

```json
{
  "format": "pnpm prettier --check",
  "format:fix": "pnpm prettier --write",
  "prettier": "prettier . --ignore-unknown"
}
```

### 注意

npm の場合は `format` や `format:fix` の際、
`npm run prettier -- --write` みたく書かないと動かないかも (検証はしてない)

`--` (Double Dash) とは、`-h` や `-v` みたいなフラグの読み取りを終了させる。
`--` (Double Dash) 以降の入力は args として取り込まれる。

- [npm run とかで使うハイフン2つ「--」の意味 - Neo's World](https://neos21.net/blog/2018/09/13-01.html)
- [The How? & Why? of the Double Dash (--) Delimiter on macOS, Linux, bash - YouTube](https://www.youtube.com/watch?v=K1zVrLi8NBA)

### 解説

- `--write`
  - 対象ファイルをフォーマット。
- `--check`
  - prettier でフォーマットがかかってるかチェックする。CI に入れとくと便利。
- `--ignore-unknown`
  - prettier に対応してない拡張子は無視する。
- `'!**/*.md'`
  - `!` をつけてファイル指定することでフォーマットから除外できる

## 設定項目

設定項目とその意図は [`src/index.ts`](./src/index.ts) のコメントを参照。

## [オプション] このような共有設定の作り方

- [Sharing configurations](https://prettier.io/docs/en/configuration.html#sharing-configurations)

## FAQ

- 別途 prettier をインストールしてなくても `@nozomiishii/prettier-config` だけで `pnpm prettier` が通るのか
  - 通る

## 参考

- [Reduce maintenance effort with shared ESLint and Prettier configs](https://blog.logrocket.com/reduce-effort-shared-eslint-prettier-configs/)
- [ESLintとPrettierの設定を共通化し、異なるプロジェクトでも同じ設定を使えるようにする](https://blog.35d.jp/2020-12-23-eslint-prettier-shareable-config)
