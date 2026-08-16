# @nozomiishii/commitlint-config

English | [日本語](./README.ja.md)

Shared [commitlint](https://commitlint.js.org) config.

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/487L0pNZKONFN01oHO/giphy.gif" alt="Coding" width="480" />
</div>
<div align="right">
  <small>via Locaweb on GIPHY</small>
</div>
<br>

## Install

Use the [`nozo`](../nozo) CLI:

```bash
pnpx nozo init
```

This adds `@nozomiishii/commitlint-config` to your `devDependencies` (pinned)
and writes a `commitlint.config.ts` that re-exports the shared config.

## Defaults

- `type-enum`: only `feat` / `fix` / `chore` / `revert` are allowed.
- `scope-empty`: scope must be empty by default. `feat: subject` passes; `feat(api): subject` is rejected.
- `commit-message-ascii-only`: body / footer / notes must be ASCII (write commit messages in English).
- `breaking-change-requires-bang`: declare breaking changes with `!` in the header. A `BREAKING CHANGE:` footer alone (no `!` in the header) is rejected, since GitHub collapses the footer in squash commits.

### Allowing scope in a consumer

Override `scope-empty` in your own `commitlint.config.ts`:

```ts
export default {
  extends: ["@nozomiishii/commitlint-config"],
  rules: {
    "scope-empty": [0, "always"],
    // Optional: pin an allow-list
    "scope-enum": [2, "always", ["api", "ui", "infra"]],
  },
};
```

## Bin

The package also ships a namespaced bin, `nozo-commitlint`, that wraps the
pinned `@commitlint/cli`. The bin name differs from the package name, so to
run it without adding the package to your `devDependencies`, pass `--package`:

```sh
# Lint the most recent commit
pnpm --package=@nozomiishii/commitlint-config dlx nozo-commitlint --last --verbose

# Lint a specific commit-msg file
pnpm --package=@nozomiishii/commitlint-config dlx nozo-commitlint --edit .git/COMMIT_EDITMSG
```

To wire it into a commit-msg git hook, see
[`@nozomiishii/lefthook-config`](../lefthook-config).

### How the config is applied

`nozo-commitlint` hands its own config to `@commitlint/cli` as an absolute
`--extends` path. The rules above therefore apply even in a repo that has no
`commitlint.config.ts`, no `package.json`, and no `node_modules`.

This matters because commitlint resolves `extends: ["@nozomiishii/commitlint-config"]`
through Node's module resolution, starting from the current directory. Without a
local `node_modules` that lookup can land on an unrelated copy of the package —
a stale npx cache, for instance — and commitlint then reports `found 0 problems`
even though none of the custom rules are registered. Passing an absolute path
takes the current directory out of the lookup, so the config either loads or
fails loudly.

`--extends` is additive, not a replacement: a repo-level `commitlint.config.ts`
is still loaded, and rules it sets still win. The shared config is only the base
layer.

To opt out and take full control, pass `--config` or `--extends` yourself — when
either flag is present, nothing is injected.
