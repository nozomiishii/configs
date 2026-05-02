# @nozomiishii/lefthook-config

English | [日本語](./README.ja.md)

Shared [lefthook](https://github.com/evilmartians/lefthook) config.

This package follows a **preset + fragments** layout: a thin preset
(`recommended.yaml`) that `extends` reusable fragments
(`hooks/<hook>/<job>.yaml`). Consumers can either pull the whole preset
or cherry-pick individual fragments.

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

Auxiliary runtimes (currently `git-harvest`, used by the `cleanup-merged`
post-merge fragment) are wrapped by shims that this package ships under
its own `bin` field, so they are exposed as `node_modules/.bin/nozo-*`
without requiring consumers to add them as direct dependencies.

## Use the full preset

`lefthook.yaml`:

```yaml
extends:
  - node_modules/@nozomiishii/lefthook-config/recommended.yaml
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
- `hooks/post-merge/update-node-modules.yaml` — pnpm > bun > npm > yarn
- `hooks/post-merge/cleanup-merged.yaml` — runs [`git-harvest`](https://github.com/nozomiishii/git-harvest) via the `nozo-git-harvest` shim shipped by this package
- `hooks/pre-commit/yaml.yaml` — fails the commit when staged files use the `.yml` extension (enforces `.yaml`)

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
  - node_modules/@nozomiishii/lefthook-config/recommended.yaml
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

### Rule 5: each shim lives where its config package lives

Most runtime tools have their own `@nozomiishii/<x>-config` package, and that package ships the `nozo-<x>` shim (e.g. `@nozomiishii/commitlint-config` ships `nozo-commitlint`). `lefthook-config` itself is the exception: it composes a few auxiliary runtimes (currently `git-harvest`) that don't have a dedicated config package, so it ships those shims (`nozo-git-harvest`) directly. The principle is "one shim per runtime, owned by exactly one package" — never duplicate.
