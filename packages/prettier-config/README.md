# @nozomiishii/prettier-config

My personal [Prettier](https://prettier.io) config.

## Install

```bash
yarn add -D @nozomiishii/prettier-config
```

## Setup

### prettierrc.js

```bash
echo "module.exports = { ...require('@nozomiishii/prettier-config') };" > .prettierrc.js
```

### (alternative plan) Edit `package.json`

```jsonc
{
  // ...
  "prettier": "@nozomiishii/prettier-config"
}
```

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
  - OSSなどでも上記を理由に119を採用してたりする

- `"proseWrap": "preserve"`  
  - default - markdownで勝手に文を折り返さないようにする

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
  - タブ2のほうが見やすい。好み

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
  - これもpython的にはspace推奨だったから、僕はタブで打つけどprettierにスペースに変換してもらう

## .prettierignore

formatかけたくないけどgitignoreもしたくないfileを書いていく。

```sh
touch .prettierignore
```

.prettierignore

```ignore
.vscode
```

## Script

```json
{
  "format": "yarn prettier --check",
  "format:fix": "yarn prettier --write",
  "prettier": "prettier . '!**/*.md' --ignore-unknown --ignore-path .gitignore",
}
```

### Sharing configurations

- [Sharing configurations](https://prettier.io/docs/en/configuration.html#sharing-configurations)

## References

- [Reduce maintenance effort with shared ESLint and Prettier configs](https://blog.logrocket.com/reduce-effort-shared-eslint-prettier-configs/)
- [ESLintとPrettierの設定を共通化し、異なるプロジェクトでも同じ設定を使えるようにする](https://blog.35d.jp/2020-12-23-eslint-prettier-shareable-config)
