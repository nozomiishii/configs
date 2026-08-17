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

### `--recommended`

By default `nozo-commitlint` is a pass-through to `@commitlint/cli`: it forwards
your arguments unchanged and lets commitlint find the config the usual way. A
repo-level `commitlint.config.ts` — including the rule overrides shown above —
keeps working exactly as it does with plain `commitlint`.

Pass `--recommended` to run against the shared config directly instead:

```sh
pnpm --package=@nozomiishii/commitlint-config dlx nozo-commitlint \
  --recommended --edit .git/COMMIT_EDITMSG
```

The flag is consumed by the shim and replaced with `--config <absolute path>`, so
the rules above apply even in a repo with no `commitlint.config.ts`, no
`package.json`, and no `node_modules`.

That matters because `extends: ["@nozomiishii/commitlint-config"]` is resolved
through Node's module resolution. Without a local `node_modules` that lookup can
land on an unrelated copy of the package — a stale npx cache, for instance — and
commitlint then reports `found 0 problems` even though none of the custom rules
are registered. An absolute path takes that lookup out of the picture, so the
config either loads or fails loudly.

Two consequences worth knowing:

- `--recommended` does **not** read a repo-level `commitlint.config.*`. If you
  need to override rules, keep the config file and omit the flag.
- Without the flag, a repo that has no reachable copy of this package silently
  lints against whatever commitlint happened to resolve. Add `--recommended`
  wherever you run the bin without an install.

`--recommended` is replaced in place, so a `--config` you pass after it still
wins.
