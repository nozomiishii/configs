# @nozomiishii/lefthook-config

[English](./README.md) | 日本語

共有可能な [lefthook](https://github.com/evilmartians/lefthook) 設定。

このパッケージは **C パターン** を採用しています: 薄いプリセット（`index.yaml`）が再利用可能なフラグメント（`hooks/<hook>/<job>.yaml`）を `extends` で取り込む構成です。利用側はプリセット全体を取り込むことも、個別のフラグメントだけを cherry-pick することもできます。

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/US7vLRTU5sAPcQcEHx/giphy.gif" alt="Coding" width="480" />
</div>
<div align="right">
  <small>via Danielle Chenette on GIPHY</small>
</div>
<br>

## インストール

```sh
pnpm add -D lefthook @nozomiishii/lefthook-config
```

補助的なランタイム（現在は `cleanup-merged` post-merge フラグメントで使う `git-harvest`）は、このパッケージの `bin` フィールドが提供する shim でラップされており、利用側が直接 dependency に追加しなくても `node_modules/.bin/nozo-*` として公開されます。

## プリセット全体を使う

`lefthook.yaml`:

```yaml
extends:
  - node_modules/@nozomiishii/lefthook-config/index.yaml
```

その後:

```sh
pnpx lefthook install
```

## フラグメントを cherry-pick する

`lefthook.yaml`:

```yaml
extends:
  - node_modules/@nozomiishii/lefthook-config/hooks/commit-msg/commitlint.yaml
  - node_modules/@nozomiishii/lefthook-config/hooks/post-merge/update-node-modules.yaml
```

## 利用可能なフラグメント

- `hooks/commit-msg/commitlint.yaml` — `nozo-commitlint`（`@nozomiishii/commitlint-config` が提供）を実行
- `hooks/post-merge/update-node-modules.yaml` — pnpm > bun > npm > yarn
- `hooks/post-merge/cleanup-merged.yaml` — このパッケージが提供する `nozo-git-harvest` shim 経由で [`git-harvest`](https://github.com/nozomiishii/git-harvest) を実行
- `hooks/pre-commit/format/prettier.yaml`
- `hooks/pre-commit/lint/markdown.yaml`
- `hooks/pre-commit/lint/file-extension/{storybook,test,yaml}.yaml`

## 設定を書く際のルール（重要）

このルール群は [evilmartians/lefthook#1258](https://github.com/evilmartians/lefthook/issues/1258) など、モノレポでの落とし穴があるために存在します。崩さないでください。

### Rule 1: extends のパスは `node_modules/<pkg>/...` から始める

Lefthook は再帰的な `extends` の途中で `root` を切り替えません。フラグメント内のファイル相対パスは利用側の git ルートから解決されようとし、黙って無視されます。

- ❌ `extends: - ./hooks/commit-msg/commitlint.yaml`
- ❌ `extends: - ../_shared/common.yaml`
- ✅ `extends: - node_modules/@nozomiishii/lefthook-config/hooks/commit-msg/commitlint.yaml`

### Rule 2: プリセットと、プリセットが既に extend しているフラグメントを同時に extend しない

Lefthook は `possible recursion in extends: path X is specified multiple times` というエラーで落ちます。

```yaml
# bad — プリセットが既に commitlint.yaml を取り込んでいるので、再度列挙すると recursion 扱いになる
extends:
  - node_modules/@nozomiishii/lefthook-config/index.yaml
  - node_modules/@nozomiishii/lefthook-config/hooks/commit-msg/commitlint.yaml
```

どちらか一方を選ぶこと: プリセットを使うか、フラグメントを cherry-pick するか — 両方やらない。

### Rule 3: shim のバイナリは namespace 付きにする

bin はフラットな namespace に置かれます。`commitlint-config` は `@commitlint/cli` の bin と衝突しないよう、shim を `commitlint` ではなく `nozo-commitlint` として公開しています。

### Rule 4: hooks は `nozo` 経由ではなく shim を直接呼ぶ

```yaml
# 速い経路
run: node_modules/.bin/nozo-commitlint --edit {1}

# 余分な spawn が発生する経路（lefthook -> nozo -> shim -> commitlint）
run: node_modules/.bin/nozo run commitlint --edit {1}
```

### Rule 5: 各 shim は対応する config パッケージに同梱する

ほとんどのランタイムツールは専用の `@nozomiishii/<x>-config` パッケージを持ち、その中に `nozo-<x>` shim を同梱しています（例: `@nozomiishii/commitlint-config` には `nozo-commitlint` が同梱）。`lefthook-config` だけは例外で、専用 config パッケージを持たない補助ランタイム（現在は `git-harvest`）を組み合わせるため、その shim（`nozo-git-harvest`）を自身で同梱しています。原則は「各ランタイムにつき shim は 1 つ、所有者は 1 つのパッケージだけ」で、重複は作らないこと。
