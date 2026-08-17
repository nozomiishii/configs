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

### `--recommended`

`nozo-commitlint` は既定では `@commitlint/cli` への pass-through です。引数をそのまま転送し、設定の探索は commitlint に任せます。repo 側の `commitlint.config.ts` — 上記の rule 上書きも含めて — は素の `commitlint` と全く同じように効きます。

共有設定で直接実行したいときは `--recommended` を渡します:

```sh
pnpm --package=@nozomiishii/commitlint-config dlx nozo-commitlint \
  --recommended --edit .git/COMMIT_EDITMSG
```

この flag は shim が消費し、`--config <絶対パス>` に置き換えられます。そのため `commitlint.config.ts` も `package.json` も `node_modules` も無い repo でも上記のルールが効きます。

これが要るのは、`extends: ["@nozomiishii/commitlint-config"]` が Node の module 解決に乗るためです。ローカルに `node_modules` が無いと、この探索が無関係なコピー — 例えば古い npx cache — に当たることがあります。その版に custom rule が無くても commitlint は `found 0 problems` と報告するため、壊れていることに気づけません。絶対パスなら探索そのものが経路から消え、設定は読めるか、はっきり失敗するかのどちらかになります。

把握しておくべき点が 2 つあります。

- `--recommended` は repo 側の `commitlint.config.*` を**読みません**。rule を上書きしたいときは設定ファイルを置いたまま flag を付けないでください。
- flag を付けないと、このパッケージに到達できない repo では従来通り黙って別の設定で lint されます。install 無しで bin を叩く場所には `--recommended` を付けてください。

`--recommended` はその位置で置き換えられるので、後ろに `--config` を渡せばそちらが勝ちます。
