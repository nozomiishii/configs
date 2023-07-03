# @nozomiishii/prettier-config

Nozomi's Recommended [Prettier](https://prettier.io) Config.

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/3o6Zt9ADoZ9grTGu1a/giphy.gif" alt="Coding" width="480" />
</div>
<br>

## Gist

- 忙しい人はとりあえず下のコマンド実行だけでオールオッケー

pnpm

```bash
npx -y @nozomiishii/prettier-config@latest
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

### Create `.prettierrc.js`

```bash
echo "module.exports = require('@nozomiishii/prettier-config');" > prettier.config.cjs
```

#### [Alternative] Edit `package.json`

```bash
npm pkg set prettier="@nozomiishii/prettier-config"
```

```jsonc
{
  // ...
  "prettier": "@nozomiishii/prettier-config"
}
```

## Scripts for package.json

```bash
npm pkg set scripts.format="pnpm prettier --check"
npm pkg set scripts.format:fix="pnpm prettier --write"
npm pkg set scripts.prettier="prettier . '!**/*.md' --ignore-unknown --ignore-path .gitignore"
```

`package.json`

```json
{
  "format": "pnpm prettier --check",
  "format:fix": "pnpm prettier --write",
  "prettier": "prettier . '!**/*.md' --ignore-unknown --ignore-path .gitignore",
}
```

### 注意

npmの場合は`format`や`format:fix`の際、  
`npm run prettier -- --write` みたく書かないと動かないかも(検証はしてない)

--(Double Dash)とは、-h, -vみたいなフラグの読み取りを終了させる。  
--(Double Dash)以降の入力はargsとして取り込まれる。

- [npm run とかで使うハイフン2つ「--」の意味 - Neo's World](https://neos21.net/blog/2018/09/13-01.html)  
- [The How? & Why? of the Double Dash (--) Delimiter on macOS, Linux, bash - YouTube](https://www.youtube.com/watch?v=K1zVrLi8NBA)

### 解説

- `--write`
  - 対象ファイルをフォーマット。  
- `--check`
  - prettierでフォーマットがかかってるかチェックする。CIに入れとくと便利。  
- `--ignore-unknown`
  - prettierに対応してない拡張子は無視する。  
- `--ignore-path .gitignore`
  - .gitignoreしてるfileはフォーマットかけない。  
- `'!**/*.md'`
  - !をつけてファイル指定することでフォーマットから除外できる
    - [prettierとmarkdownと日本語の相性の悩み]
    - PrettierのMarkdownフォーマットに日本語が混じってると、英語と日本語の間にスペースが勝手に挿入されたり挙動が謎い。MarkdownのフォーマットはMarkdownlintにまかせる。もしくは `.`で全体指定してからブラックリストで弾くのではなく`**/*.{ts,tsx}`てきにホワイトリストで管理した方がいいかもしれない、、、

## Preferences

- `"arrowParens": "always"`  
  - const fn = (a) ⇒ {}　かconst fn = a ⇒ {}って書くか
  - パラメータ加えていくのに楽したいので()ありで

- `"bracketSpacing": true`
  - import {a} from "module"　かimport { a } from "module"
  - trueが好み

- `"htmlWhitespaceSensitivity": "css"`
  - default

- `"insertPragma": false`
  - default

- `"jsxBracketSameLine": false`
  - falseのが差分増やさずにプロパティ付け足しやすい

```tsx
// true
<button
  className="prettier-class"
  id="prettier-id"
  onClick={this.handleClick}>
  Click Here
</button>
// false
<button
  className="prettier-class"
  id="prettier-id"
  onClick={this.handleClick}
>
  Click Here
</button>
```

- `"jsxSingleQuote": false`  
  - default

- `"printWidth": 119`  
  - 1行あたりの文字数。  
  - Githubのコードレビュー画面の幅と同じ

- `"proseWrap": "preserve"`  
  - default

- `"quoteProps": "as-needed"`  
  - default

- `"requirePragma": false`  
  - default

- `"semi": true`  
  - セミコロンがあったほうがJavaScript感あって好き。好み
  - 即時関数のときに以下みたい括弧の前にセミコロンがつくようになるのもあんまり好きじゃない

```typescript
;(function () {
  // code...
})()
```

- `"singleQuote": true`  
  - ダブルクオート派だったけど、なんとなくtutorialの先生たちがシングルクオート多くて、それに合わせて

- `"tabWidth": 2`  
  - タブ2のほうがJavaScriptっぽい気がしてる。好み

- `"trailingComma": "all"`  
  - 全部にカンマあったほうがgitの差分に出てこないからall

```tsx
const id = {
  a: 1234567890,
  b: 1234567890,
  c: 1234567890,
  d: 1234567890,
};
```

- `"useTabs": false`  
  - タブ幅は開発者の環境依存する。spaceは倍打鍵しなきゃいけない。自分はタブで打つけどprettierにスペースに変換してもらう。

## .prettierignore

formatかけたくないけどgitignoreもしたくないfileを書いていく。

```sh
touch .prettierignore
```

.prettierignore

```ignore
.vscode
```

## [Option] How to create sharing configurations like this

- [Sharing configurations](https://prettier.io/docs/en/configuration.html#sharing-configurations)

## FAQ

- 別途prettierインストールしてなくても`@nozomiishii/prettier-config`だけでpnpm prettierが通るのか
  - 通る

## References

- [Reduce maintenance effort with shared ESLint and Prettier configs](https://blog.logrocket.com/reduce-effort-shared-eslint-prettier-configs/)
- [ESLintとPrettierの設定を共通化し、異なるプロジェクトでも同じ設定を使えるようにする](https://blog.35d.jp/2020-12-23-eslint-prettier-shareable-config)
