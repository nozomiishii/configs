# @nozomiishii/prettier-config

Nozomi's Recommended [Prettier](https://prettier.io) Config.

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/3o6Zt9ADoZ9grTGu1a/giphy.gif" alt="Coding" width="480" />
</div>
<div align="right">
  <p style="font-size: 0.75em; color: #656D76;">via South Park on GIPHY</p>
</div>
<br>

## Gist

- 忙しい人はとりあえず下のコマンド実行だけでオールオッケー

pnpm

```bash
pnpx @nozomiishii/prettier-config@latest
```

## Install

```bash
pnpm add -D @nozomiishii/prettier-config
```

- `@nozomiishii/prettier-config`だけでいい。`prettier`別途入れなくていい。

### Included Plugins

- [prettier-plugin-packagejson](https://www.npmjs.com/package/prettier-plugin-packagejson)
  - package.jsonをいいかんじに並び替え

#### [Option]

- [@prettier/plugin-ruby](https://www.npmjs.com/package/@prettier/plugin-ruby)
  - BrewfileなどRubyのfileもformatしたい
  - プロジェクト内でrubyが多い場合は、[rufo](https://github.com/ruby-formatter/rufo)のほうがいいかも
- [prettier-plugin-sh](https://www.npmjs.com/package/prettier-plugin-sh)
  - shellのfileもformatしたい
  - プロジェクト内でshellが多い場合は、[shfmt](https://github.com/mvdan/sh)のほうがいいかも

```sh
pnpm add -D @prettier/plugin-ruby
```

## Setup

### Create `prettier.config.js`

```bash
echo "export { default } from '@nozomiishii/prettier-config';" > prettier.config.js
```

## Scripts for package.json

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

npmの場合は`format`や`format:fix`の際、  
`npm run prettier -- --write` みたく書かないと動かないかも(検証はしてない)

--(Double Dash)とは、-h, -vみたいなフラグの読み取りを終了させる。  
--(Double Dash)以降の入力はargsとして取り込まれる。

- [npm run とかで使うハイフン2つ「--」の意味 - Neo's World](https://neos21.net/blog/2018/09/13-01.html)
- [The How? & Why? of the Double Dash (--) Delimiter on macOS, Linux, bash - YouTube](https://www.youtube.com/watch?v=K1zVrLi8NBA)

## Preferences

設定項目とその意図は [`src/index.ts`](./src/index.ts) のコメントを参照。

## [Option] How to create sharing configurations like this

- [Sharing configurations](https://prettier.io/docs/en/configuration.html#sharing-configurations)

## FAQ

- 別途prettierインストールしてなくても`@nozomiishii/prettier-config`だけでpnpm prettierが通るのか
  - 通る

## References

- [Reduce maintenance effort with shared ESLint and Prettier configs](https://blog.logrocket.com/reduce-effort-shared-eslint-prettier-configs/)
- [ESLintとPrettierの設定を共通化し、異なるプロジェクトでも同じ設定を使えるようにする](https://blog.35d.jp/2020-12-23-eslint-prettier-shareable-config)
