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
- `commit-message-ascii-only`: header / body / footer / notes must all be ASCII (write commit messages in English).
- `breaking-change-requires-bang`: declare breaking changes with `!` in the header. A `BREAKING CHANGE:` footer alone (no `!` in the header) is rejected, since GitHub collapses the footer in squash commits.

### Overriding rules

The bin always lints with the bundled config. To override it, pass `--config`
explicitly:

```sh
commitlint --config commitlint.config.ts --edit .git/COMMIT_EDITMSG
```

```ts
// commitlint.config.ts
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

The package ships a bin named `commitlint` that wraps the pinned
`@commitlint/cli`. It works zero-config: unless `--config` is passed explicitly,
it always uses the bundled config and never reads the project's
`commitlint.config.*` nor any home / global config (this prevents stale global
configs from being picked up in projects without a config).

`nozo-commitlint` is published as an alias for the same wrapper. Prefer it in
git hooks and CI, where the command should be unambiguous about which binary it
runs.

### With mise (no package manager required)

Projects without a package.json can install the bin via
[mise](https://mise.jdx.dev)'s npm backend:

```toml
# mise.toml
[tools]
"npm:@nozomiishii/commitlint-config" = "latest"
```

```sh
# Lint the most recent commit
commitlint --last --verbose

# Lint a specific commit-msg file
commitlint --edit .git/COMMIT_EDITMSG
```

### With pnpm dlx

The bin name differs from the package name, so to run it without adding the
package to your `devDependencies`, pass `--package`:

```sh
pnpm --package=@nozomiishii/commitlint-config dlx nozo-commitlint --last --verbose
```

### npm's flat installs

`@commitlint/cli` publishes a `commitlint` bin of its own. mise and pnpm expose
only this package's bin, but npm hoists the transitive one into
`node_modules/.bin` and it can win the name. Under npm, call `nozo-commitlint`.

To wire it into a commit-msg git hook, see
[`@nozomiishii/lefthook-config`](../lefthook-config).
