# CLAUDE.md

このリポジトリで Claude Code (claude.ai/code) が作業する際のガイドラインです。

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

## packages/prettier-config: requirePragma による除外方針

- `packages/prettier-config/src/index.ts` の `overrides` で `pnpm-lock.yaml` / `submodules/**` / `next-env.d.ts` / `*.md` / `*.mdx` を `requirePragma: true` で除外している。
- これは `.prettierignore` を導入すると `.gitignore` と二重管理になり、片方だけ更新する事故を起こしやすいため、「明らかに format 不要」と分かりきっているものは shareable config 側で `requirePragma` を使って一括除外する方針を採っている（Prettier の一般的慣習からは離れるが意図的）。

## リリース・Conventional Commits

- `BREAKING CHANGE:` フッターと `feat!:` / `fix!:` の `!` 修飾は、**リリースされるパッケージ・公開アセットの互換性を破る変更にのみ**使用する。CI / workflows / branch protection / リポジトリ運用上の変更には使わない。これらの注意事項は PR 本文に記述する（release-please など自動リリースツールが major / minor バンプを誤って行い、CHANGELOG に `⚠ BREAKING CHANGES` セクションを誤生成するのを防ぐため。実例: 2026-04-25 にこのリポジトリ群で `chore: migrate reusable workflows to v3.0.0` PR が誤って BREAKING CHANGE として記録された）。
- shared-config (例: `prettier-config`) の挙動変更で発生する cascade reformat は、**設定変更 PR (`feat(<config>)!: ...`) と必ず別 PR に分離**し、scope なしの `chore: reformat ...` で出すこと。同一 PR の squash commit に混ざると release-please の path-based 振り分けにより、変更 scope と無関係なパッケージにも `⚠ BREAKING CHANGES` セクションと minor バンプが波及する（実例: 2026-05-01 の PR #2140 / #2141 が release PR #2128 で全パッケージに BREAKING を誤付与）。
