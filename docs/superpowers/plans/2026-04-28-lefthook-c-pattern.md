# lefthook C-pattern Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Phase 1 (commitlint shim) and Phase 2 (lefthook-config C-pattern migration with git-harvest integration and bun support) per the spec at `docs/superpowers/specs/2026-04-28-lefthook-c-pattern-design.md`. Also commit the existing nozo CLI rebuild that is currently untracked / unstaged in this worktree.

**Architecture:**
- All work happens on the existing branch `worktree-jazzy-giggling-dawn`.
- Three commits stacked on top of the two spec commits already on the branch:
  1. `feat(nozo): rebuild CLI` — moves `apps/nozo` → `packages/nozo`, replaces the placeholder with a citty/clack/consola entry-point
  2. `feat(commitlint-config)!: replace bin with nozo-commitlint shim` — Phase 1
  3. `feat(lefthook-config)!: migrate to C-pattern with git-harvest cleanup` — Phase 2
- Push the branch once at the end and open one PR per commit using `gh pr create`. The user merges manually.

**Tech Stack:** pnpm workspaces, Node.js (>=20, ESM), bash, lefthook v2.1.6, `@commitlint/cli@20.5.0`, `git-harvest@0.1.20`, tsdown, citty, `@clack/prompts`, consola.

**PR title type-enum:** This repository's commitlint enforces `type-enum: [2, 'always', ['feat', 'fix', 'chore']]`. **`refactor`, `docs`, `style` etc. are rejected**. The plan uses `feat` / `fix` / `chore` only. PR title scope/`!` modifier follows the project rule that `!` is reserved for releasable-package compat breaks.

---

## Pre-flight

- [ ] **Step P1: confirm branch and recent history**

Run:
```sh
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn rev-parse --abbrev-ref HEAD
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn log --oneline -3
```
Expected: branch is `worktree-jazzy-giggling-dawn`. Recent commits include `39f8dfde chore(docs): integrate git-harvest...` and `64705667 chore(docs): add design spec...`.

- [ ] **Step P2: confirm worktree dirty state matches spec PR1 expectations**

Run:
```sh
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn status --short
```
Expected output includes:
```
 M .github/.release-please-config.json
 M .github/.release-please-manifest.json
 D apps/nozo/.gitignore
 D apps/nozo/README.md
 D apps/nozo/rust/Cargo.lock
 D apps/nozo/rust/Cargo.toml
 D apps/nozo/rust/src/main.rs
 D apps/nozo/typescript/CHANGELOG.md
 D apps/nozo/typescript/package.json
 D apps/nozo/typescript/src/index.js
 M pnpm-lock.yaml
 M pnpm-workspace.yaml
?? packages/nozo/
```

If anything else appears (e.g. stray edits in `packages/lefthook-config/`), STOP and reconcile before continuing.

- [ ] **Step P3: confirm pnpm install passes from current state**

Run: `pnpm install`
Expected: install completes without error. Lockfile may have residual unstaged churn.

---

## Task 1: Stage and commit the nozo CLI rebuild (PR1 candidate)

**Files:**
- Delete: `apps/nozo/.gitignore`, `apps/nozo/README.md`, `apps/nozo/rust/{Cargo.lock,Cargo.toml,src/main.rs}`, `apps/nozo/typescript/{CHANGELOG.md,package.json,src/index.js}`
- Rename: `apps/nozo/typescript/CHANGELOG.md` → `packages/nozo/CHANGELOG.md`; `apps/nozo/README.md` → `packages/nozo/README.md`; `apps/nozo/typescript/package.json` → `packages/nozo/package.json`
- Create (currently untracked): `packages/nozo/.gitignore`, `packages/nozo/tsconfig.json`, `packages/nozo/tsdown.config.ts`, `packages/nozo/src/index.ts`, `packages/nozo/src/commands/init.ts`
- Modify: `.github/.release-please-config.json`, `.github/.release-please-manifest.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `packages/nozo/package.json`

- [ ] **Step 1.1: stage every nozo-related path explicitly (no git add -A)**

Run:
```sh
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn add \
  apps/ \
  packages/nozo/ \
  pnpm-lock.yaml \
  pnpm-workspace.yaml \
  .github/.release-please-config.json \
  .github/.release-please-manifest.json
```

- [ ] **Step 1.2: verify the staged set is exactly the nozo-related changes (no docs/, no commitlint-config, no lefthook-config)**

Run:
```sh
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn diff --cached --stat
```
Expected: list contains only `apps/nozo/*`, `packages/nozo/*`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.github/.release-please-config.json`, `.github/.release-please-manifest.json`. **NO `docs/*`. NO `packages/commitlint-config/*`. NO `packages/lefthook-config/*`.**

If any other file is staged, run `git -C <worktree> reset HEAD <path>` for that file.

- [ ] **Step 1.3: confirm packages/nozo/src/ has the expected files before committing**

Run: `ls -la packages/nozo/src/ packages/nozo/src/commands/`
Expected: `index.ts`, `commands/init.ts` present.

- [ ] **Step 1.4: commit nozo CLI rebuild**

Run:
```sh
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn commit -m "$(cat <<'EOF'
feat(nozo): rebuild CLI with citty + clack + consola

Move apps/nozo/typescript -> packages/nozo and rebuild the CLI on
top of citty (subcommand routing), @clack/prompts (interactive
wizard), and consola (structured logging). The Rust prototype
under apps/nozo/rust is removed; TypeScript is the single
implementation path.

Replace the previous console.log placeholder with a real entry
point that delegates to citty for builtin subcommands and falls
back to a PATH dispatch (cargo / git style) for nozo-<plugin>
binaries. Wire up 'init' as a builtin placeholder using clack's
intro/outro and consola.info.

Update pnpm-workspace.yaml and the release-please config /
manifest to reflect the apps -> packages move.

Refs: #2118
EOF
)"
```

- [ ] **Step 1.5: verify commit landed**

Run:
```sh
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn log --oneline -4
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn status --short
```
Expected: top commit is `feat(nozo): rebuild CLI...`. `git status --short` is empty (clean tree).

---

## Task 2: Phase 1 — replace commitlint-config bin with nozo-commitlint shim

**Files:**
- Create: `packages/commitlint-config/bin/cli.mjs`
- Modify: `packages/commitlint-config/package.json` (`bin` field)
- Delete: `packages/commitlint-config/bin/cli.sh`

- [ ] **Step 2.1: write the shim**

Create `packages/commitlint-config/bin/cli.mjs` with content:

```js
#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const cli = require.resolve('@commitlint/cli/cli.js');
spawn(process.execPath, [cli, ...process.argv.slice(2)], { stdio: 'inherit' })
  .on('exit', (code) => process.exit(code ?? 1));
```

- [ ] **Step 2.2: chmod +x the shim**

Run:
```sh
chmod +x packages/commitlint-config/bin/cli.mjs
ls -la packages/commitlint-config/bin/cli.mjs
```
Expected: mode shows `-rwxr-xr-x`.

- [ ] **Step 2.3: update package.json bin field**

Edit `packages/commitlint-config/package.json`:

```diff
-  "bin": "bin/cli.sh",
+  "bin": { "nozo-commitlint": "bin/cli.mjs" },
```

(`files` field already includes `bin/`, so no change needed.)

- [ ] **Step 2.4: delete the old setup script**

Run:
```sh
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn rm packages/commitlint-config/bin/cli.sh
```
Expected: `rm 'packages/commitlint-config/bin/cli.sh'`. The deletion is staged.

- [ ] **Step 2.5: re-install dependencies to refresh node_modules/.bin**

Run: `pnpm install`
Expected: pnpm replays the bin link. No errors.

- [ ] **Step 2.6: smoke-test the shim resolves @commitlint/cli@20.5.0**

Run: `node_modules/.bin/nozo-commitlint --version`
Expected: prints `@commitlint/cli@20.5.0` (or just `20.5.0` depending on the cli's output format).

- [ ] **Step 2.7: smoke-test the shim validates a real commit message**

Run:
```sh
echo "feat: example for shim test" > /tmp/nozo-shim-test-msg
node_modules/.bin/nozo-commitlint --edit /tmp/nozo-shim-test-msg --verbose
```
Expected: exit 0, output contains `found 0 problems, 0 warnings`.

- [ ] **Step 2.8: smoke-test the shim catches invalid messages**

Run:
```sh
echo "bad subject" > /tmp/nozo-shim-test-msg-bad
node_modules/.bin/nozo-commitlint --edit /tmp/nozo-shim-test-msg-bad --verbose
echo "exit: $?"
```
Expected: non-zero exit; `subject-empty` / `type-empty` errors printed. The trailing line shows `exit: 1`.

- [ ] **Step 2.9: stage and verify Phase 1 changeset**

Run:
```sh
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn add \
  packages/commitlint-config/bin/cli.mjs \
  packages/commitlint-config/package.json \
  pnpm-lock.yaml
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn diff --cached --stat
```
Expected staged paths (the `rm` from Step 2.4 is already staged):
- `packages/commitlint-config/bin/cli.mjs` (new)
- `packages/commitlint-config/bin/cli.sh` (deleted)
- `packages/commitlint-config/package.json` (modified)
- `pnpm-lock.yaml` (if changed)

**No other paths.** If any leak, unstage them.

- [ ] **Step 2.10: commit Phase 1**

Run:
```sh
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn commit -m "$(cat <<'EOF'
feat(commitlint-config)!: replace bin/cli.sh with nozo-commitlint shim

Add a 10-line Node shim at bin/cli.mjs that resolves and invokes
@commitlint/cli@20.5.0 (already pinned in dependencies). The
package now exposes a single namespaced bin entry,
nozo-commitlint, replacing the previous setup script.

Lefthook-config will invoke this shim directly via
node_modules/.bin/nozo-commitlint instead of the previous
pnpx commitlint@latest, eliminating the per-commit network fetch
and locking the commitlint version to what is in the lockfile.

BREAKING CHANGE: bin field changes from a single setup script
("bin": "bin/cli.sh") to a namespaced map
({ "nozo-commitlint": "bin/cli.mjs" }). Consumers who previously
ran `pnpx @nozomiishii/commitlint-config@latest` to scaffold a
commitlint config now need a different mechanism (planned for
nozo init in a follow-up PR).

Refs: #2118
EOF
)"
```

- [ ] **Step 2.11: verify commit and clean tree**

Run:
```sh
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn log --oneline -5
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn status --short
```
Expected: top commit is `feat(commitlint-config)!: replace bin/cli.sh...`. `git status --short` is empty.

---

## Task 3: Phase 2 prep — install git-harvest and update lefthook-config package.json

**Files:**
- Modify: `packages/lefthook-config/package.json`
- Modify: `pnpm-lock.yaml` (auto)

- [ ] **Step 3.1: edit package.json — drop bin field, add git-harvest dependency**

Edit `packages/lefthook-config/package.json`:

```diff
   "main": "index.yaml",
-  "bin": "bin/cli.sh",
   "dependencies": {
-    "lefthook": "2.1.6"
+    "lefthook": "2.1.6",
+    "git-harvest": "0.1.20"
   },
```

(Final `dependencies` has both keys; `bin` field is removed entirely.)

- [ ] **Step 3.2: install to update lockfile**

Run: `pnpm install`
Expected: `pnpm-lock.yaml` updated; `node_modules/.bin/git-harvest` symlink created.

- [ ] **Step 3.3: smoke-test git-harvest is reachable**

Run: `node_modules/.bin/git-harvest --version`
Expected: prints `0.1.20`.

Run: `node_modules/.bin/git-harvest --help` (sanity)
Expected: usage text mentions `--all`, `--dry-run`, `--help`, `--version`.

- [ ] **Step 3.4: leave package.json + pnpm-lock.yaml staged for the Phase 2 commit (do NOT commit yet)**

Run:
```sh
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn add \
  packages/lefthook-config/package.json \
  pnpm-lock.yaml
```

(Phase 2 will land as a single commit after all fragment work is done. Do not commit at this step.)

---

## Task 4: Phase 2 — migrate commit-msg fragments to jobs syntax

**Files:**
- Modify: `packages/lefthook-config/hooks/commit-msg/commitlint.yaml`
- Modify: `packages/lefthook-config/hooks/commit-msg/spell.yaml`

- [ ] **Step 4.1: rewrite commitlint.yaml — jobs + shim direct invoke**

Replace the entire content of `packages/lefthook-config/hooks/commit-msg/commitlint.yaml` with:

```yaml
commit-msg:
  jobs:
    - name: commitlint
      run: node_modules/.bin/nozo-commitlint --edit {1} --verbose
```

- [ ] **Step 4.2: rewrite spell.yaml — jobs syntax only (existing buggy behavior intentionally preserved per spec D8)**

Replace the entire content of `packages/lefthook-config/hooks/commit-msg/spell.yaml` with:

```yaml
commit-msg:
  jobs:
    - name: cspell
      run: npx -y @nozomiishii/cspell-config@latest {1}
```

(Functionally identical to the old `commands:` map; the buggy behavior of invoking the cspell-config setup script is preserved by design — fixing it is out of scope per spec.)

---

## Task 5: Phase 2 — migrate post-merge fragments + bun support + git-harvest + rename

**Files:**
- Modify: `packages/lefthook-config/hooks/post-merge/update-node-modules.yaml`
- Rename: `packages/lefthook-config/hooks/post-merge/delete-merged-branches.yaml` → `packages/lefthook-config/hooks/post-merge/cleanup-merged.yaml`
- Modify (the renamed file): content swap to invoke `node_modules/.bin/git-harvest`

- [ ] **Step 5.1: rewrite update-node-modules.yaml — jobs + bun (order: pnpm > bun > npm > yarn)**

Replace the entire content of `packages/lefthook-config/hooks/post-merge/update-node-modules.yaml` with:

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

- [ ] **Step 5.2: rename delete-merged-branches.yaml → cleanup-merged.yaml using git mv**

Run:
```sh
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn mv \
  packages/lefthook-config/hooks/post-merge/delete-merged-branches.yaml \
  packages/lefthook-config/hooks/post-merge/cleanup-merged.yaml
```
Expected: file moved, rename staged.

- [ ] **Step 5.3: rewrite the renamed cleanup-merged.yaml — jobs + git-harvest invoke**

Replace the entire content of `packages/lefthook-config/hooks/post-merge/cleanup-merged.yaml` with:

```yaml
post-merge:
  jobs:
    - name: cleanup-merged
      run: node_modules/.bin/git-harvest
```

(No flags. Default behavior is to delete merged branches/worktrees only — equivalent to the old `cleanup-merged.sh` 87-line script.)

---

## Task 6: Phase 2 — migrate pre-commit fragments to jobs syntax (preset-unattached)

**Files:**
- Modify: `packages/lefthook-config/hooks/pre-commit/format/prettier.yaml`
- Modify: `packages/lefthook-config/hooks/pre-commit/lint/markdown.yaml`
- Modify: `packages/lefthook-config/hooks/pre-commit/lint/file-extension/storybook.yaml`
- Modify: `packages/lefthook-config/hooks/pre-commit/lint/file-extension/test.yaml`
- Modify: `packages/lefthook-config/hooks/pre-commit/lint/file-extension/yaml.yaml`

These five fragments stay in the repo as cherry-pick targets. They are **not** included in the new `index.yaml`. Behavior is unchanged; only syntax is migrated.

- [ ] **Step 6.1: rewrite prettier.yaml**

Replace the entire content of `packages/lefthook-config/hooks/pre-commit/format/prettier.yaml` with:

```yaml
pre-commit:
  jobs:
    - name: format-prettier
      # Markdown formatting is the responsibility of the markdownlint job
      exclude: ".*\\.md$|.*pnpm-lock\\.yaml$"
      run: npx -y prettier {staged_files} --ignore-unknown --ignore-path .gitignore --write
```

- [ ] **Step 6.2: rewrite markdown.yaml**

Replace the entire content of `packages/lefthook-config/hooks/pre-commit/lint/markdown.yaml` with:

```yaml
pre-commit:
  jobs:
    - name: lint-markdown
      glob: '*.md'
      run: npx -y markdownlint-cli2 {staged_files}
```

- [ ] **Step 6.3: rewrite file-extension/storybook.yaml**

Replace the entire content of `packages/lefthook-config/hooks/pre-commit/lint/file-extension/storybook.yaml` with:

```yaml
pre-commit:
  jobs:
    - name: lint-file-extension-storybook
      files: git diff --name-only --staged
      glob: '*.story.{tsx,mdx}'
      run: echo "Error! \"*.story.{tsx,mdx}\" extension found, please use \"*.stories.{tsx,mdx}\" instead." && exit 1
```

- [ ] **Step 6.4: rewrite file-extension/test.yaml**

Replace the entire content of `packages/lefthook-config/hooks/pre-commit/lint/file-extension/test.yaml` with:

```yaml
pre-commit:
  jobs:
    - name: lint-file-extension-test
      files: git diff --name-only --staged
      glob: '*.spec.{js,ts}'
      run: echo "Error! \".spec.{js,ts}\" extension found, please use \".test.ts\" instead." && exit 1
```

- [ ] **Step 6.5: rewrite file-extension/yaml.yaml**

Replace the entire content of `packages/lefthook-config/hooks/pre-commit/lint/file-extension/yaml.yaml` with:

```yaml
pre-commit:
  jobs:
    - name: lint-file-extension-yaml
      files: git diff --name-only --staged
      glob: '*.yml'
      run: echo "Error! \".yml\" extension found, please use \".yaml\" instead." && exit 1
```

---

## Task 7: Phase 2 — delete obsolete files

**Files (delete):**
- `packages/lefthook-config/index-extends.yaml`
- `packages/lefthook-config/bin/cli.sh`
- `packages/lefthook-config/scripts/cleanup-merged.sh`
- `packages/lefthook-config/hooks/post-merge/update-node-modules-with-ni.yaml`

- [ ] **Step 7.1: remove the four obsolete files**

Run:
```sh
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn rm \
  packages/lefthook-config/index-extends.yaml \
  packages/lefthook-config/bin/cli.sh \
  packages/lefthook-config/scripts/cleanup-merged.sh \
  packages/lefthook-config/hooks/post-merge/update-node-modules-with-ni.yaml
```
Expected: 4 files removed, deletions staged.

- [ ] **Step 7.2: confirm the bin and scripts directories are now empty (and remove them if so)**

Run:
```sh
ls packages/lefthook-config/bin/ 2>/dev/null
ls packages/lefthook-config/scripts/ 2>/dev/null
```
If either directory remains and is empty, leave it — git does not track empty directories, so they will silently disappear from the index. No action.

---

## Task 8: Phase 2 — write the new index.yaml (C-pattern preset)

**Files:**
- Modify (full rewrite): `packages/lefthook-config/index.yaml`

- [ ] **Step 8.1: replace the entire index.yaml content**

Replace the entire content of `packages/lefthook-config/index.yaml` with:

```yaml
# @nozomiishii/lefthook-config — recommended preset (C pattern)
#
# This preset is composed of fragments via `extends`. Consumers can either
# extend this file as-is, or cherry-pick individual fragments under hooks/.
#
# @see https://github.com/evilmartians/lefthook
# @see https://github.com/nozomiishii/configs/blob/main/packages/lefthook-config/README.md
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

---

## Task 9: Phase 2 — update README with C-pattern docs and the 5 rules

**Files:**
- Modify: `packages/lefthook-config/README.md`

- [ ] **Step 9.1: replace README content**

Replace the entire content of `packages/lefthook-config/README.md` with:

```markdown
# @nozomiishii/lefthook-config

Nozomi's Recommended [lefthook](https://github.com/evilmartians/lefthook) config.

This package follows the **C pattern**: a thin preset (`index.yaml`) that
`extends` reusable fragments (`hooks/<hook>/<job>.yaml`). Consumers can
either pull the whole preset or cherry-pick individual fragments.

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/US7vLRTU5sAPcQcEHx/giphy.gif" alt="Coding" width="480" />
</div>
<div align="right">
  <small>via Danielle Chenette on GIPHY</small>
</div>
<br>

## Install

```sh
pnpm add -D lefthook @nozomiishii/lefthook-config
```

## Use the full preset

`lefthook.yaml`:

```yaml
extends:
  - ./node_modules/@nozomiishii/lefthook-config/index.yaml
```

Then:

```sh
pnpx lefthook install
```

## Cherry-pick fragments

`lefthook.yaml`:

```yaml
extends:
  - ./node_modules/@nozomiishii/lefthook-config/hooks/commit-msg/commitlint.yaml
  - ./node_modules/@nozomiishii/lefthook-config/hooks/post-merge/update-node-modules.yaml
```

## Available fragments

- `hooks/commit-msg/commitlint.yaml` — runs `nozo-commitlint` (provided by `@nozomiishii/commitlint-config`)
- `hooks/commit-msg/spell.yaml`
- `hooks/post-merge/update-node-modules.yaml` — pnpm > bun > npm > yarn
- `hooks/post-merge/cleanup-merged.yaml` — runs [`git-harvest`](https://github.com/nozomiishii/git-harvest)
- `hooks/pre-commit/format/prettier.yaml`
- `hooks/pre-commit/lint/markdown.yaml`
- `hooks/pre-commit/lint/file-extension/{storybook,test,yaml}.yaml`

## Authoring rules (important)

These rules exist because of [evilmartians/lefthook#1258](https://github.com/evilmartians/lefthook/issues/1258) and other monorepo footguns. Please keep them.

### Rule 1: extends paths start with `node_modules/<pkg>/...`

Lefthook does not change `root` during recursive `extends`. File-relative paths inside fragments resolve from the consumer git root and silently get ignored.

- ❌ `extends: - ./hooks/commit-msg/commitlint.yaml`
- ❌ `extends: - ../_shared/common.yaml`
- ✅ `extends: - node_modules/@nozomiishii/lefthook-config/hooks/commit-msg/commitlint.yaml`

### Rule 2: do not extend the preset and a fragment that the preset already extends

Lefthook errors with `possible recursion in extends: path X is specified multiple times`.

Pick one: either the preset, or cherry-pick fragments — not both.

### Rule 3: shim binaries are namespaced

Bins are in a flat namespace. `commitlint-config` exposes its shim as `nozo-commitlint`, not `commitlint`, to avoid colliding with `@commitlint/cli`'s own bin.

### Rule 4: hooks invoke shims directly, not via `nozo`

```yaml
# ✅ fast path
run: node_modules/.bin/nozo-commitlint --edit {1}

# ❌ extra spawn (lefthook -> nozo -> shim -> commitlint)
run: node_modules/.bin/nozo run commitlint --edit {1}
```

### Rule 5: shims live in the config package, not in `lefthook-config`

`@nozomiishii/lefthook-config` does not ship its own bin. Each runtime tool's shim is provided by the corresponding config package (e.g. `@nozomiishii/commitlint-config` ships `nozo-commitlint`).
```

---

## Task 10: Verify Phase 1 + Phase 2 end-to-end

- [ ] **Step 10.1: re-install to refresh extends and fragments**

Run: `pnpm install`
Expected: clean install, no errors. Lockfile may have minor churn for `git-harvest`.

- [ ] **Step 10.2: dump the merged lefthook config**

Run: `pnpx lefthook dump`
Expected: output is a single merged YAML containing **all of**:
- `commit-msg.jobs` with `name: commitlint` and `run:` containing `node_modules/.bin/nozo-commitlint --edit {1} --verbose`
- `post-merge.jobs` with `name: update-node-modules` and `run:` containing the pnpm/bun/npm/yarn ladder
- `post-merge.jobs` with `name: cleanup-merged` and `run: node_modules/.bin/git-harvest`
- `commit-msg.parallel: true` and `post-merge.parallel: true`

- [ ] **Step 10.3: dry-run the commit-msg hook against a known-good message**

Run:
```sh
echo "feat: smoke test" > /tmp/lefthook-msg
pnpx lefthook run --verbose commit-msg --files /tmp/lefthook-msg
```
Expected: commitlint job runs and exits 0. The verbose log shows it invoking `node_modules/.bin/nozo-commitlint`.

- [ ] **Step 10.4: dry-run the commit-msg hook against a known-bad message**

Run:
```sh
echo "broken subject without type" > /tmp/lefthook-msg-bad
pnpx lefthook run --verbose commit-msg --files /tmp/lefthook-msg-bad
echo "exit: $?"
```
Expected: non-zero exit. `subject-empty` / `type-empty` failures shown. `exit: 1`.

- [ ] **Step 10.5: smoke-test git-harvest in isolation**

Run: `node_modules/.bin/git-harvest --version`
Expected: `0.1.20`.

Run: `node_modules/.bin/git-harvest --dry-run`
Expected: prints what would be cleaned up; exit 0. Does not actually delete anything.

- [ ] **Step 10.6: confirm the deleted files are really gone**

Run:
```sh
test ! -e packages/lefthook-config/index-extends.yaml && echo "OK: index-extends.yaml removed"
test ! -e packages/lefthook-config/bin/cli.sh && echo "OK: bin/cli.sh removed"
test ! -e packages/lefthook-config/scripts/cleanup-merged.sh && echo "OK: scripts/cleanup-merged.sh removed"
test ! -e packages/lefthook-config/hooks/post-merge/update-node-modules-with-ni.yaml && echo "OK: ni fragment removed"
test ! -e packages/lefthook-config/hooks/post-merge/delete-merged-branches.yaml && echo "OK: rename source removed"
test ! -e packages/commitlint-config/bin/cli.sh && echo "OK: commitlint-config setup removed"
```
Expected: all six lines print `OK: ...`.

---

## Task 11: Stage and commit Phase 2

- [ ] **Step 11.1: stage all Phase 2 changes**

Run:
```sh
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn add \
  packages/lefthook-config/ \
  pnpm-lock.yaml
```

- [ ] **Step 11.2: review the full Phase 2 diff before committing**

Run:
```sh
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn diff --cached --stat
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn diff --cached -- packages/lefthook-config/index.yaml
```

Expected staged paths:
- `packages/lefthook-config/index.yaml` (modified)
- `packages/lefthook-config/index-extends.yaml` (deleted)
- `packages/lefthook-config/bin/cli.sh` (deleted)
- `packages/lefthook-config/package.json` (modified)
- `packages/lefthook-config/README.md` (modified)
- `packages/lefthook-config/scripts/cleanup-merged.sh` (deleted)
- `packages/lefthook-config/hooks/commit-msg/commitlint.yaml` (modified)
- `packages/lefthook-config/hooks/commit-msg/spell.yaml` (modified)
- `packages/lefthook-config/hooks/post-merge/cleanup-merged.yaml` (renamed from delete-merged-branches.yaml + content modified)
- `packages/lefthook-config/hooks/post-merge/update-node-modules.yaml` (modified)
- `packages/lefthook-config/hooks/post-merge/update-node-modules-with-ni.yaml` (deleted)
- `packages/lefthook-config/hooks/pre-commit/format/prettier.yaml` (modified)
- `packages/lefthook-config/hooks/pre-commit/lint/markdown.yaml` (modified)
- `packages/lefthook-config/hooks/pre-commit/lint/file-extension/storybook.yaml` (modified)
- `packages/lefthook-config/hooks/pre-commit/lint/file-extension/test.yaml` (modified)
- `packages/lefthook-config/hooks/pre-commit/lint/file-extension/yaml.yaml` (modified)
- `pnpm-lock.yaml` (modified)

**No other paths.**

- [ ] **Step 11.3: commit Phase 2**

Run:
```sh
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn commit -m "$(cat <<'EOF'
feat(lefthook-config)!: migrate to C-pattern with git-harvest cleanup

Restructure the package as a thin preset (index.yaml) that extends
reusable fragments under hooks/<hook>/<job>.yaml. Every fragment
uses lefthook's jobs[] syntax instead of the deprecated commands{}
map. The preset configures hook-level options (parallel: true)
while fragments contain only job definitions.

Functional changes vs. the previous monolithic index.yaml:

- commit-msg.commitlint now invokes node_modules/.bin/nozo-commitlint
  (provided by @nozomiishii/commitlint-config), pinning
  @commitlint/cli to the version in the lockfile and removing the
  pnpx commitlint@latest network fetch.

- post-merge.cleanup-merged now invokes
  node_modules/.bin/git-harvest (the dedicated cleanup CLI shipped
  as a bash script). The 87-line scripts/cleanup-merged.sh is
  removed; git-harvest is added as a dependency at version 0.1.20.

- post-merge.update-node-modules adds bun support. Detection order
  is pnpm > bun > npm > yarn. The previous redundant
  update-node-modules-with-ni.yaml fragment is removed (its global
  auto-install of @antfu/ni was an unwanted side effect).

The pre-commit fragments (prettier, markdownlint, file-extension
checks) keep their previous behavior; they are migrated to jobs[]
syntax but remain unattached to the preset and are available for
consumers to cherry-pick.

BREAKING CHANGE: The shape of @nozomiishii/lefthook-config has
changed substantially:
- index.yaml is now a thin extends-only preset (no inline jobs)
- index-extends.yaml is removed
- bin field removed (the package no longer ships a setup script;
  scaffolding moves to nozo init in a follow-up)
- scripts/cleanup-merged.sh removed (replaced by git-harvest)
- hooks/post-merge/delete-merged-branches.yaml renamed to
  cleanup-merged.yaml and rewritten to call git-harvest
- All fragments use jobs[] syntax; consumers extending fragments
  with the old commands{} expectation may need updates

Refs: #2118
EOF
)"
```

- [ ] **Step 11.4: verify the commit and a clean tree**

Run:
```sh
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn log --oneline -6
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn status --short
```
Expected: top three commits are
```
<sha> feat(lefthook-config)!: migrate to C-pattern with git-harvest cleanup
<sha> feat(commitlint-config)!: replace bin/cli.sh with nozo-commitlint shim
<sha> feat(nozo): rebuild CLI with citty + clack + consola
```
followed by the two spec commits. `status --short` is empty.

---

## Task 12: Push branch and open PRs

- [ ] **Step 12.1: push the branch with upstream tracking**

Run:
```sh
git -C /Users/nozomiishii/Code/nozomiishii/configs/.claude/worktrees/jazzy-giggling-dawn push -u origin worktree-jazzy-giggling-dawn
```
Expected: branch pushed; remote tracking set up.

- [ ] **Step 12.2: open PR for nozo CLI rebuild (Task 1's commit)**

Per CLAUDE.md, use `--body-file` (not `--body`) to avoid command-injection prompts on `#` headings. Both PRs target the **same branch** so they cannot stack as separate PRs against `main` from one branch — see decision below.

**Branch strategy decision needed.** This plan creates 3 commits on `worktree-jazzy-giggling-dawn`. There are two ways to split into PRs:

a. **Single PR with 3 commits** — open one PR titled `feat: lefthook C-pattern + nozo CLI rebuild`. The body lists each commit. Reviewers see all 3 commits but the PR title must subsume the most-impactful change. Simpler. Recommended.

b. **Three separate branches via cherry-pick** — create `nozo-rebuild`, `commitlint-shim`, and `lefthook-c-pattern` branches off `main`, cherry-pick each commit onto them, push, and open 3 PRs. More setup, more rigorous review.

**Pause here and ask the user which split strategy they want.** Do not push or open PRs until the user picks.

- [ ] **Step 12.3 (after user picks strategy): open PR(s)**

For option **a** (single PR), the body file template:

```sh
BODY_FILE=$(mktemp)
cat > "$BODY_FILE" <<'EOF'
## Summary

- nozo CLI が citty + @clack/prompts + consola で再実装され、apps/nozo から packages/nozo へ移動した
- `@nozomiishii/commitlint-config` が `nozo-commitlint` shim を持ち、`@commitlint/cli@20.5.0` をピンで呼ぶ
- `@nozomiishii/lefthook-config` が C パターンに移行（preset + fragments）、`commands` を全て `jobs` 構文化、`cleanup-merged.sh` を `git-harvest@0.1.20` に置き換え、`update-node-modules` に bun 対応を追加

## 含まれる commit

1. `feat(nozo): rebuild CLI with citty + clack + consola`
2. `feat(commitlint-config)!: replace bin/cli.sh with nozo-commitlint shim`
3. `feat(lefthook-config)!: migrate to C-pattern with git-harvest cleanup`

## Spec

`docs/superpowers/specs/2026-04-28-lefthook-c-pattern-design.md`

## Test plan

- [ ] `pnpm install` がクリーンに通る
- [ ] `pnpx lefthook dump` が新しい preset の merge 結果を出力する
- [ ] `pnpx lefthook run --verbose commit-msg --files /tmp/msg` で `node_modules/.bin/nozo-commitlint` が呼ばれる
- [ ] `node_modules/.bin/nozo-commitlint --version` が 20.5.0 を返す
- [ ] `node_modules/.bin/git-harvest --version` が 0.1.20 を返す
- [ ] `node_modules/.bin/git-harvest --dry-run` が exit 0 で削除候補を表示する

Refs: #2118
EOF

gh pr create \
  --title "feat: lefthook C-pattern migration + nozo CLI rebuild" \
  --base main \
  --body-file "$BODY_FILE"
```

For option **b**, follow these steps per branch:
1. `git checkout -b <branch> origin/main`
2. `git cherry-pick <sha>`
3. `git push -u origin <branch>`
4. `gh pr create --title "<title>" --base main --body-file <file>`

(The user merges all PRs manually — AI must not run `gh pr merge`.)

---

## Self-Review

**Spec coverage:**

| Spec section | Tasks |
|---|---|
| D1 (delete commitlint cli.sh) | Task 2 (Step 2.4) |
| D2 (bun support, ni delete) | Task 5 (Step 5.1), Task 7 (Step 7.1) |
| D3 (rename to cleanup-merged.yaml) | Task 5 (Step 5.2) |
| D4 (commands→jobs migration) | Tasks 4, 5, 6 |
| D5 (parallel in preset, jobs in fragment) | Task 8 |
| D6 (delete lefthook-config bin/cli.sh) | Task 3 (bin field removal), Task 7 (file delete) |
| D7 (delete index-extends.yaml, rewrite index.yaml) | Tasks 7, 8 |
| D8 (pre-commit jobs only, not in preset) | Task 6 |
| D9 (git-harvest@0.1.20 replaces cleanup-merged.sh) | Task 3 (deps), Task 5 (Step 5.3), Task 7 (script delete) |
| New file: bin/cli.mjs | Task 2 (Step 2.1) |
| New cleanup-merged.yaml content | Task 5 (Step 5.3) |
| New index.yaml content | Task 8 |
| Verification PASS conditions | Task 10 |
| PR breakdown | Task 12 (with strategy gate) |

**Placeholder scan:** No TODOs, TBDs, "appropriate error handling", "similar to Task N" patterns found. Every code block is complete and the engineer can copy-paste.

**Type / name consistency:**
- `nozo-commitlint` is used as the bin name in Task 2 (Step 2.3), Task 4 (Step 4.1), and Task 10 (Step 10.3). Consistent.
- `git-harvest@0.1.20` version pin is consistent in Task 3 (Step 3.1) and Task 10 (Step 10.5).
- `cleanup-merged.yaml` (new) name matches the rename target in Task 5 (Step 5.2) and reference in `index.yaml` Task 8.
- pnpm > bun > npm > yarn ordering is consistent in Task 5 (Step 5.1) glob and conditions.

No issues found.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-04-28-lefthook-c-pattern.md`.**

Two execution options:

1. **Subagent-Driven (recommended)** — dispatch a fresh subagent per task, two-stage review between tasks, fast iteration.
2. **Inline Execution** — execute tasks in this session using `superpowers:executing-plans`, batch with checkpoints for review.

Which approach? (Or pause here and review the plan first.)
