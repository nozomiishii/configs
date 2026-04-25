# CLAUDE.md

このリポジトリで Claude Code (claude.ai/code) が作業する際のガイドラインです。

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

- PR タイトルは英語 semantic 形式で、CI の semantic pull request チェックに従う。詳細は [.github/workflows/_pull-request.yaml](.github/workflows/_pull-request.yaml) を参照。

## アーキテクチャ概要

`configs` は `pnpm` を使った共有設定モノレポです。`packages/` に各種ツール（commitlint / ESLint / lefthook / prettier / tsconfig など）の設定をパッケージとして提供します。

主要ディレクトリ:

- `packages/`: `@nozomiishii/*-config` 系
- `apps/`: 設定やサンプル
- `lefthook.yaml`: Git hooks の設定
- `.github/workflows/`: CI（release-please 等）

## 重要なパターン

- 設定変更は基本的に `packages/` 配下の設定・ドキュメント側を優先して更新する。
- フォーマット・リントは `pnpm format` / `pnpm prettier` と `pnpm fix:md`（markdown）を使う。

## リリース・Conventional Commits

- `BREAKING CHANGE:` フッターと `feat!:` / `fix!:` の `!` 修飾は、**リリースされるパッケージ・公開アセットの互換性を破る変更にのみ**使用する。CI / workflows / branch protection / リポジトリ運用上の変更には使わない。これらの注意事項は PR 本文に記述する（release-please など自動リリースツールが major / minor バンプを誤って行い、CHANGELOG に `⚠ BREAKING CHANGES` セクションを誤生成するのを防ぐため。実例: 2026-04-25 にこのリポジトリ群で `chore: migrate reusable workflows to v3.0.0` PR が誤って BREAKING CHANGE として記録された）。
