# CLAUDE.md

このリポジトリで Claude Code (claude.ai/code) が作業する際のガイドラインです。

## アーキテクチャ概要

`configs` は `pnpm` を使った共有設定モノレポです。`packages/` に各種ツール（commitlint / ESLint / lefthook / prettier / tsconfig など）の設定をパッケージとして提供します。

## ファイル拡張子方針

- TypeScript / JavaScript の拡張子は `.ts` / `.js` のみを使用する。`.mjs` / `.cjs` は使わない。
- 全パッケージが `"type": "module"` のため `.js` は ESM として解釈される。tsdown 出力・bin stub などすべて `.js` で統一する。

## 重要なパターン

- 設定変更は基本的に `packages/` 配下の設定・ドキュメント側を優先して更新する。

## テスト配置

- Unit Test はテスト対象のファイルと同じ階層に配置する（例: `src/init.ts` のテストは `src/init.test.ts`）。
- `tests/` ディレクトリでまとめて分離するスタイルは採用しない。配置を見るだけで「どのファイルにテストがあるか」が分かるようにするのが狙い。
- setup / teardown は `beforeEach` / `afterEach` などの hook を避け、vitest の [`test.extend`](https://vitest.dev/guide/test-context.html) による fixture で書く。各 test が context 経由で依存を明示的に受け取ることで、test 間の hidden state（密結合）を排除する。
- 既存テストが `tests/` 配下にあるパッケージは、新規テストから順次同階層配置に移行する。

## packages/prettier-config: 運用方針

### `requirePragma` による除外方針

- `packages/prettier-config/src/index.ts` の `overrides` で `pnpm-lock.yaml` / `submodules/**` / `next-env.d.ts` / `*.md` / `*.mdx` を `requirePragma: true` で除外している。
- これは `.prettierignore` を導入すると `.gitignore` と二重管理になり、片方だけ更新する事故を起こしやすいため、「明らかに format 不要」と分かりきっているものは shareable config 側で `requirePragma` を使って一括除外する方針を採っている（Prettier の一般的慣習からは離れるが意図的）。
- 同じ理由から Prettier 3.6 で追加された `checkIgnorePragma` (`@noformat` / `@noprettier`) も採用しない。opt-out の入り口を増やすだけで `.prettierignore` 問題そのものは解決しないため。

### experimental option は採用しない

- Prettier の `experimental*` 系オプション (`experimentalOperatorPosition` / `experimentalTernaries` など) は今回も今後も採用しない。formatter は出力が揃ってさえいれば挙動の細部はどうでもよく、stable 化されて default になるのを待てば足りる。
- ユーザー判断の文脈: formatter (Prettier / Biome / oxfmt) の覇権争いが落ち着くまでは experimental に乗らない方針。

### oxfmt への移行方針

- 将来的に [oxfmt](https://oxc.rs/) (Prettier 100% 互換、import sort 内蔵) に移行する意図はある。トリガーは **oxlint が ESLint のルールを完全に飲み込んだとき**。それまでは Prettier を使い続ける。
- oxfmt は Prettier の config をそのまま受け取れる設計のため、本パッケージの設定は移行時にほぼそのまま流用できる見込み。逆に oxfmt 互換ではない Prettier plugin を増やすほど将来の移行コストが上がるため、必須でない plugin (`prettier-plugin-tailwindcss` / `prettier-plugin-sh` 等) は追加しない方針。

## リリース・Conventional Commits

- `BREAKING CHANGE:` フッターと `feat!:` / `fix!:` の `!` 修飾は、**リリースされるパッケージ・公開アセットの互換性を破る変更にのみ**使用する。CI / workflows / branch protection / リポジトリ運用上の変更には使わない。これらの注意事項は PR 本文に記述する（release-please など自動リリースツールが major / minor バンプを誤って行い、CHANGELOG に `⚠ BREAKING CHANGES` セクションを誤生成するのを防ぐため。実例: 2026-04-25 にこのリポジトリ群で `chore: migrate reusable workflows to v3.0.0` PR が誤って BREAKING CHANGE として記録された）。
- shared-config (例: `prettier-config`) の挙動変更で発生する cascade reformat は、**設定変更 PR (`feat(<config>)!: ...`) と必ず別 PR に分離**し、scope なしの `chore: reformat ...` で出すこと。同一 PR の squash commit に混ざると release-please の path-based 振り分けにより、変更 scope と無関係なパッケージにも `⚠ BREAKING CHANGES` セクションと minor バンプが波及する（実例: 2026-05-01 の PR #2140 / #2141 が release PR #2128 で全パッケージに BREAKING を誤付与）。
