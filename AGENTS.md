# AGENTS.md

このリポジトリで Claude Code (claude.ai/code) が作業する際のガイドラインです。

## 言語

- 応答言語: プラン、説明、返答は常に日本語で行う。コードやコマンド、技術用語はそのまま使用してよい。
- PR 本文: プルリクエストの本文（body）は日本語で記述する。

## よく使うコマンド

```sh
# Install / dependencies
pnpm install

# Prettier check
pnpm format

# Prettier format
pnpm format:fix

# Fix markdown lint issues
pnpm fix:md

# Prettier (write)
pnpm prettier

# Cleanup
pnpm clean:all
pnpm clean:node

# postinstall
pnpm postinstall
```

## Git・GitHub 運用ルール

- PR のマージは必ずユーザーが手動で行う。AI アシスタントが `gh pr merge` や GitHub API 経由でマージを実行してはならない。
- PR の作成・更新・push は許可するが、マージの最終判断は常にユーザーに委ねること。
- PR タイトルは英語 semantic 形式で、CI の semantic pull request チェックに従う。詳細は [.github/workflows/_pull-request.yaml](.github/workflows/_pull-request.yaml) を参照。

## アーキテクチャ概要

`configs` は `pnpm` を使った共有設定モノレポです。`packages/` に各種ツール（commitlint / ESLint / lefthook / prettier / tsconfig など）の設定をパッケージとして提供します。

主要ディレクトリ:

- `packages/`: `@nozomiishii/*-config` 系
- `apps/`: 設定やサンプル
- `lefthook.yaml`: Git hooks の設定
- `.github/workflows/`: CI（release-please 等）

## GitHub Actions ワークフロー命名規則

- **`_` プレフィックス付き** (`_actionlint.yaml`, `_secretlint.yaml` 等): 他プロジェクトでも共通で使う汎用ワークフロー。
- **`_` プレフィックスなし** (`release.yaml` 等): このプロジェクト固有のワークフロー。

## テストスタイル

- テストタイトル（`test("...")` / `describe("...")`）は英語で記述する。
- テストの上に簡潔な日本語コメントを添える。
- テストファイルはソースと同じディレクトリに `{name}.test.ts` で配置する。

## README フォーマットルール

README.ja.md（日本語）と README.md（英語）は同じ構成を保つ。新しい項目を追加する際は両方を更新する。

## 重要なパターン

- 設定変更は基本的に `packages/` 配下の設定・ドキュメント側を優先して更新する。
- フォーマット・リントは `pnpm format` / `pnpm prettier` と `pnpm fix:md`（markdown）を使う。
