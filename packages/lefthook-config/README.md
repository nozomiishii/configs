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
pnpm add -D lefthook git-harvest @nozomiishii/lefthook-config
```

`git-harvest` is invoked by the `cleanup-merged` post-merge fragment via
`node_modules/.bin/git-harvest`. Listing it as a direct dependency of
your project guarantees the binary is hoisted into your top-level
`node_modules/.bin/`, regardless of package manager (pnpm strict layout,
npm, yarn).

## Use the full preset

`lefthook.yaml`:

```yaml
extends:
  - node_modules/@nozomiishii/lefthook-config/index.yaml
```

Then:

```sh
pnpx lefthook install
```

## Cherry-pick fragments

`lefthook.yaml`:

```yaml
extends:
  - node_modules/@nozomiishii/lefthook-config/hooks/commit-msg/commitlint.yaml
  - node_modules/@nozomiishii/lefthook-config/hooks/post-merge/update-node-modules.yaml
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

```yaml
# bad — preset already pulls in commitlint.yaml, listing it again triggers recursion
extends:
  - node_modules/@nozomiishii/lefthook-config/index.yaml
  - node_modules/@nozomiishii/lefthook-config/hooks/commit-msg/commitlint.yaml
```

Pick one: either the preset, or cherry-pick fragments — not both.

### Rule 3: shim binaries are namespaced

Bins are in a flat namespace. `commitlint-config` exposes its shim as `nozo-commitlint`, not `commitlint`, to avoid colliding with `@commitlint/cli`'s own bin.

### Rule 4: hooks invoke shims directly, not via `nozo`

```yaml
# fast path
run: node_modules/.bin/nozo-commitlint --edit {1}

# extra spawn (lefthook -> nozo -> shim -> commitlint)
run: node_modules/.bin/nozo run commitlint --edit {1}
```

### Rule 5: shims live in the config package, not in `lefthook-config`

`@nozomiishii/lefthook-config` does not ship its own bin. Each runtime tool's shim is provided by the corresponding config package (e.g. `@nozomiishii/commitlint-config` ships `nozo-commitlint`).
