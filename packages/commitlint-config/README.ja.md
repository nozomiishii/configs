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
- `commit-message-ascii-only`: header / body / footer / notes すべて ASCII のみ（コミットメッセージは英語で書く）。
- `breaking-change-requires-bang`: 破壊的変更は header の `!` で宣言する。`BREAKING CHANGE:` footer 単独（header に `!` なし）は弾かれる。GitHub の squash commit では footer が畳まれて見えないため。

### ルールを上書きする

`nozo-commitlint` は常に同梱 config で検査する。上書きしたいときは `--config` を明示する:

```sh
nozo-commitlint --config commitlint.config.ts --edit .git/COMMIT_EDITMSG
```

```ts
// commitlint.config.ts
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

このパッケージは pin された `@commitlint/cli` をラップする `nozo-commitlint` という namespace 付きの bin を同梱しています。zero-config で動く: `--config` を明示しない限り常に同梱 config を使い、プロジェクトの `commitlint.config.*` や home / グローバルの config は読まない (config が無いプロジェクトで古いグローバル設定が拾われる事故を防ぐため)。

### mise で使う (package manager 不要)

package.json の無いプロジェクトでも、[mise](https://mise.jdx.dev) の npm backend で bin をそのまま導入できる:

```toml
# mise.toml
[tools]
"npm:@nozomiishii/commitlint-config" = "latest"
```

```sh
# 直近のコミットを lint
nozo-commitlint --last --verbose

# 特定の commit-msg ファイルを lint
nozo-commitlint --edit .git/COMMIT_EDITMSG
```

### pnpm dlx で使う

bin 名はパッケージ名と異なるため、`devDependencies` に追加せず実行するときは `--package` でパッケージを指定します:

```sh
pnpm --package=@nozomiishii/commitlint-config dlx nozo-commitlint --last --verbose
```

commit-msg の git hook に組み込む方法は [`@nozomiishii/lefthook-config`](../lefthook-config) を参照。
