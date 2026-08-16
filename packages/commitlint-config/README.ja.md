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

[`nozo`](../nozo) CLI を使う:

```bash
pnpx nozo init
```

これで `@nozomiishii/commitlint-config` が pin で `devDependencies` に追加され、shared config を re-export する `commitlint.config.ts` が生成される。

## デフォルト挙動

- `type-enum`: `feat` / `fix` / `chore` / `revert` のみ許可。
- `scope-empty`: デフォルトで scope 禁止。`feat: subject` は通り、`feat(api): subject` は弾かれる。
- `commit-message-ascii-only`: body / footer / notes は ASCII のみ（コミットメッセージは英語で書く）。
- `breaking-change-requires-bang`: 破壊的変更は header の `!` で宣言する。`BREAKING CHANGE:` footer 単独（header に `!` なし）は弾かれる。GitHub の squash commit では footer が畳まれて見えないため。

### consumer 側で scope を許可する

自分の `commitlint.config.ts` で `scope-empty` を上書きする:

```ts
export default {
  extends: ["@nozomiishii/commitlint-config"],
  rules: {
    "scope-empty": [0, "always"],
    // 任意: 許可する scope を絞り込みたいとき
    "scope-enum": [2, "always", ["api", "ui", "infra"]],
  },
};
```

## 同梱 bin

このパッケージは pin された `@commitlint/cli` をラップする `nozo-commitlint` という namespace 付きの bin も同梱しています。bin 名はパッケージ名と異なるため、`devDependencies` に追加せず実行するときは `--package` でパッケージを指定します:

```sh
# 直近のコミットを lint
pnpm --package=@nozomiishii/commitlint-config dlx nozo-commitlint --last --verbose

# 特定の commit-msg ファイルを lint
pnpm --package=@nozomiishii/commitlint-config dlx nozo-commitlint --edit .git/COMMIT_EDITMSG
```

commit-msg の git hook に組み込む方法は [`@nozomiishii/lefthook-config`](../lefthook-config) を参照。

### 設定の適用のされ方

`nozo-commitlint` は自分の設定を絶対パスの `--extends` として `@commitlint/cli` に渡します。そのため `commitlint.config.ts` も `package.json` も `node_modules` も無い repo でも、上記のルールが効きます。

commitlint は `extends: ["@nozomiishii/commitlint-config"]` を、カレントディレクトリを起点にした Node の module 解決で探します。ローカルに `node_modules` が無いと、この探索が無関係なコピー — 例えば古い npx cache — に当たることがあります。その版に custom rule が無くても commitlint は `found 0 problems` と報告するため、壊れていることに気づけません。絶対パスを渡せば解決経路からカレントディレクトリが外れ、設定は読めるか、はっきり失敗するかのどちらかになります。

`--extends` は置き換えではなく追加です。repo 側の `commitlint.config.ts` は引き続き読まれ、そこで設定した rule が勝ちます。共有設定はあくまで下敷きです。

注入をやめて自分で制御したいときは `--config` か `--extends` を明示的に渡してください。どちらかがあるときは何も注入しません。
