---
title: lefthook-config C-pattern migration + commitlint shim
date: 2026-04-28
status: approved
references:
  - https://github.com/nozomiishii/configs/issues/2118
---

# lefthook-config C-pattern migration (Phase 1 + Phase 2)

## Scope

このドキュメントは Issue #2118「RFC: nozo CLI 再実装 / shim パターン / lefthook-config C パターン移行」の **Phase 1 + Phase 2** に絞った差分 design spec。Issue #2118 を base document とし、本書はその差分・追加確定事項・本 brainstorming で発覚した drift の処理のみを記す。

### Out-of-Scope

| Phase | 内容 | 扱い |
|---|---|---|
| 3 | `@nozomiishii/cspell-config` への shim 横展開 | 別 PR |
| 4 | `nozo init` の対話実装 | 別 PR |
| 5 | v1.0.0 統一リリース | 別 brainstorming |
| 6 | 細かい片付け | 別 PR |

## Goals

1. `@nozomiishii/commitlint-config` に shim パターンを導入し、`node_modules/.bin/nozo-commitlint` 経由で **固定バージョンの `@commitlint/cli@20.5.0`** を呼べるようにする
2. `@nozomiishii/lefthook-config` を **C パターン (preset + fragment)** に移行し、Issue #1258 の罠を回避した stable な extends 構造を確立する
3. lefthook hook の `commit-msg.commitlint` が **shim を直叩き** する形になり、`pnpx commitlint@latest` の都度 fetch が消える

## Non-Goals

- pre-commit hook を preset に追加（現行 `index.yaml` には pre-commit が無く、追加は consumer breaking change → 別 PR で機能追加として）
- `spell.yaml` のバグ修正（cspell-config の setup script を毎回呼ぶ挙動。preset では active でないため実害ゼロ → 別 issue）
- リリース戦略の変更（release-please 設定変更 + v1.0.0 trigger は別 PR）

## Decisions

Issue #2118 に未記載 / 未決の項目について、本 spec で確定する。

### D1. `commitlint-config/bin/cli.sh` を Phase 1 で削除

旧 setup script は将来 `nozo init` で代替予定。bin slot を `nozo-commitlint` 1 個に絞り、PR の意図を「shim パターン導入」に限定する。

### D2. `update-node-modules.yaml` に bun 対応追加、ni 版は削除

**判定順序: pnpm > bun > npm > yarn**。

- `@antfu/ni` は global auto-install を hook が勝手に実行する副作用があり、configs 配布物として不適切
- `ni` だと pnpm 時の `--frozen-lockfile` が指定できず post-merge で意図しない lockfile 変動が起きうる
- 標準 PM 直叩きでも bun を含めれば 4 分岐で済む

bun のロックファイル判定は `bun.lock` (1.2+ text) と `bun.lockb` (旧 binary) の OR で。yarn は最後（実運用で使わない）。

### D3. `delete-merged-branches.yaml` を `cleanup-merged.yaml` に rename

ファイル名と内部 job 名 (`cleanup-merged`) の drift を解消。C パターンでは fragment 名 = 主要 job 名にしておくと cherry-pick 時のメンタルモデルが揃う。

### D4. fragment は全部 `commands:` → `jobs:` 構文に統一

Issue #2118 の方針通り。`commands:` は map、`jobs:` は array で構造が違うが、本リポジトリの fragment はどれも 1 hook につき 1 job しか定義していないので変換は機械的。

### D5. `parallel: true` は preset 側、jobs 配列は fragment 側で分業

Hook 単位の設定 (`parallel`, `piped`) は preset、個別 job 定義は fragment、という分離。lefthook の extends は同じ hook の設定を merge してくれるので機能的に等価。

### D6. `lefthook-config/bin/cli.sh` を Phase 2 で削除

Issue Rule 5「shim は config パッケージ自身の bin。lefthook-config 自身は shim を持たない」に従い、`bin` field 自体を削除。`@nozomiishii/lefthook-config` パッケージから setup スクリプト bin を提供しない。

### D7. `index-extends.yaml` を完全削除、`index.yaml` を C パターンに rewrite

試行錯誤の残骸 `index-extends.yaml` は削除し、実運用ファイル `index.yaml` を「extends だけの薄い preset」に上書き。役割が `index.yaml` に集約される。

### D8. pre-commit fragment 5 個は preset に含めず、`jobs:` 構文化のみ実施

現行 `index.yaml` には pre-commit が一切含まれていない。preset に追加すると consumer 側の挙動が変わる (breaking)。今回は構造改修に専念し、pre-commit 系は jobs 化だけして cherry-pick 用に残す。

### D9. `cleanup-merged.sh` を `git-harvest@0.1.20` に差し替え

[nozomiishii/git-harvest](https://github.com/nozomiishii/git-harvest) は本リポジトリで管理している cleanup CLI（v0.1.20、2026-04-08 リリース、MIT、bash スクリプト直配布）。現在の 87 行の `scripts/cleanup-merged.sh` と同等の挙動を、より洗練された UI（非 TTY 検出済み animation 抑制）と squash-merge 検出付きで提供する。

- **runtime 要件なし**: bash スクリプト（`#!/usr/bin/env bash`）。bun も node も不要、`pnpm install` で `node_modules/.bin/git-harvest` に展開されるだけ
- **hook 向きの挙動**: non-interactive、prompt なし、何もない時は "nothing to harvest" で exit 0
- **`--all` は使わない**: デフォルトの「merged のみ削除」が現行 `cleanup-merged.sh` と等価
- **version pin**: Phase 1 の shim パターンと同じ精神で、`0.1.20` を `dependencies` に固定（`@latest` は使わない）

**今 (nozo 統合前) に取り込む理由**: ユーザー希望により「nozo に巻き取られる前に独立 CLI として動作確認したい」。動作が安定してから将来 `nozo cleanup` 等への統合を検討する。

変更内容:
- `packages/lefthook-config/package.json` の `dependencies` に `"git-harvest": "0.1.20"` を追加
- `hooks/post-merge/cleanup-merged.yaml` の `run:` を `node_modules/.bin/git-harvest` に置き換え
- `packages/lefthook-config/scripts/cleanup-merged.sh` を削除（git-harvest が肩代わり）

## Final structure

```
packages/lefthook-config/
├── hooks/
│   ├── commit-msg/
│   │   ├── commitlint.yaml           # jobs + nozo-commitlint shim 直叩き
│   │   └── spell.yaml                # jobs 化のみ
│   ├── post-merge/
│   │   ├── update-node-modules.yaml  # jobs + bun 対応 (pnpm > bun > npm > yarn)
│   │   └── cleanup-merged.yaml       # rename from delete-merged-branches.yaml
│   └── pre-commit/                    # preset 不参加。jobs 化のみ
│       ├── format/prettier.yaml
│       ├── lint/markdown.yaml
│       └── lint/file-extension/{storybook,test,yaml}.yaml
├── index.yaml                         # extends だけの薄い preset
├── package.json                       # bin field 削除 + git-harvest@0.1.20 を deps 追加
└── README.md                          # C パターン + 5 ルール明記

DELETED:
- packages/lefthook-config/index-extends.yaml
- packages/lefthook-config/bin/cli.sh
- packages/lefthook-config/hooks/post-merge/update-node-modules-with-ni.yaml
- packages/lefthook-config/scripts/cleanup-merged.sh        # git-harvest@0.1.20 で代替

packages/commitlint-config/
├── bin/cli.mjs                        # 新規 shim (~10 行)
├── package.json                       # bin: { nozo-commitlint: bin/cli.mjs }
└── ... (src, dist, README, tsdown 設定 等 変更なし)

DELETED:
- packages/commitlint-config/bin/cli.sh
```

## New file contents

### `packages/commitlint-config/bin/cli.mjs`

```js
#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const cli = require.resolve('@commitlint/cli/cli.js');
spawn(process.execPath, [cli, ...process.argv.slice(2)], { stdio: 'inherit' })
  .on('exit', (code) => process.exit(code ?? 1));
```

実行権限 (`chmod +x`) を付与し commit する。

### `packages/commitlint-config/package.json` 変更

```diff
- "bin": "bin/cli.sh",
+ "bin": { "nozo-commitlint": "bin/cli.mjs" },
```

`files: ["bin", "dist", "README.md"]` は変更不要（`bin/` ディレクトリごと npm publish に含まれる）。

### `packages/lefthook-config/index.yaml` (新)

```yaml
# @nozomiishii/lefthook-config — recommended preset (C pattern)
#
# Run the command to test:
#   pnpx lefthook run [-v,--verbose] <hook-name>

extends:
  - node_modules/@nozomiishii/lefthook-config/hooks/commit-msg/commitlint.yaml
  - node_modules/@nozomiishii/lefthook-config/hooks/post-merge/update-node-modules.yaml
  - node_modules/@nozomiishii/lefthook-config/hooks/post-merge/cleanup-merged.yaml

commit-msg:
  parallel: true

post-merge:
  parallel: true
```

### `packages/lefthook-config/hooks/commit-msg/commitlint.yaml`

```yaml
commit-msg:
  jobs:
    - name: commitlint
      run: node_modules/.bin/nozo-commitlint --edit {1} --verbose
```

### `packages/lefthook-config/hooks/post-merge/update-node-modules.yaml`

```yaml
post-merge:
  jobs:
    - name: update-node-modules
      files: git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD
      glob: '**/{package.json,pnpm-lock.yaml,bun.lock,bun.lockb,package-lock.json,yarn.lock}'
      run: |
        if [ -f "pnpm-lock.yaml" ]; then
          echo "🥊 Installing dependencies with pnpm..."
          pnpm install --frozen-lockfile
          exit 0
        fi
        if [ -f "bun.lock" ] || [ -f "bun.lockb" ]; then
          echo "🥊 Installing dependencies with bun..."
          bun install --frozen-lockfile
          exit 0
        fi
        if [ -f "package-lock.json" ]; then
          echo "🥊 Installing dependencies with npm..."
          npm install
          exit 0
        fi
        if [ -f "yarn.lock" ]; then
          echo "🥊 Installing dependencies with yarn..."
          yarn install
          exit 0
        fi
```

### `packages/lefthook-config/hooks/post-merge/cleanup-merged.yaml`

```yaml
post-merge:
  jobs:
    - name: cleanup-merged
      run: node_modules/.bin/git-harvest
```

### `packages/lefthook-config/package.json` 変更

```diff
  "dependencies": {
-   "lefthook": "2.1.6"
+   "lefthook": "2.1.6",
+   "git-harvest": "0.1.20"
  },
- "bin": "bin/cli.sh",
```

### Other fragments (jobs 構文化のみ)

以下は `commands:` (map) を `jobs:` (array) に機械的変換するだけ。中身の動作は不変。

- `hooks/commit-msg/spell.yaml`
- `hooks/pre-commit/format/prettier.yaml`
- `hooks/pre-commit/lint/markdown.yaml`
- `hooks/pre-commit/lint/file-extension/storybook.yaml`
- `hooks/pre-commit/lint/file-extension/test.yaml`
- `hooks/pre-commit/lint/file-extension/yaml.yaml`

## Verification

PR 2 merge 前に root の `lefthook.yaml` から以下を確認:

```sh
pnpm install
pnpx lefthook dump            # 現行と等価な merge 結果が得られるか
pnpx lefthook run --verbose commit-msg
echo "feat: test" > /tmp/msg
pnpx lefthook run --verbose commit-msg --files /tmp/msg
node_modules/.bin/nozo-commitlint --version
```

PASS 条件:
- `lefthook dump` の出力に `commit-msg.commitlint`, `post-merge.cleanup-merged`, `post-merge.update-node-modules` が含まれる
- `commit-msg.commitlint` の `run:` が `node_modules/.bin/nozo-commitlint --edit ...` になっている
- `nozo-commitlint --version` が `@commitlint/cli@20.5.0` の version を返す
- `node_modules/.bin/git-harvest --version` が `0.1.20` を返す
- `node_modules/.bin/git-harvest` を merge 後リポで実行すると、merged ブランチを削除して exit 0、何もない時は "nothing to harvest" で exit 0
- bun lockfile (`bun.lock` か `bun.lockb`) を含む repo で post-merge が `bun install --frozen-lockfile` を呼ぶ (smoke test)

## PR breakdown

| # | Title | Contents |
|---|---|---|
| 1 | `refactor(nozo): rebuild CLI with citty + clack + consola` | `apps/nozo/*` → `packages/nozo/*` 移動 + nozo CLI 再実装 (現 worktree の untracked / unstaged 全部) |
| 2 | `feat(lefthook-config)!: migrate to C-pattern with shim runner` | Phase 1 (commitlint shim) + Phase 2 (lefthook C pattern)。`!` 付き = breaking (`bin` field 変更、ファイル rename、構造変更) |
| 3 | `chore(release-please): linked-versions + v1.0.0` | 別 brainstorming で詳細化 |

PR 1 と PR 2 はファイル領域が重ならないため独立に出せる。merge 順は PR1 → PR2 → PR3。

PR2 のタイトルに付ける `!` (breaking change) 表記は **CLAUDE.md の運用ルールにより、リリースされるパッケージの互換性を破る変更にのみ使用**する。本 PR は `@nozomiishii/lefthook-config` と `@nozomiishii/commitlint-config` の bin field・hook fragment 構造を変えるため、これは正しく breaking change に該当する。

## References

- Base: [Issue #2118 — RFC: nozo CLI 再実装 / shim パターン / lefthook-config C パターン移行](https://github.com/nozomiishii/configs/issues/2118)
- Lefthook bug context: [evilmartians/lefthook#1258](https://github.com/evilmartians/lefthook/issues/1258)
- Public C-pattern example: [@dlinc/lefthook-config](https://www.npmjs.com/package/@dlinc/lefthook-config)
