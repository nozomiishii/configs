# @nozomiishii/prettier-config

English | [日本語](./README.ja.md)

Shared [Prettier](https://prettier.io) config.

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/3o6Zt9ADoZ9grTGu1a/giphy.gif" alt="Coding" width="480" />
</div>
<div align="right">
  <p style="font-size: 0.75em; color: #656D76;">via South Park on GIPHY</p>
</div>
<br>

## Install

Use the [`nozo`](../nozo) CLI:

```bash
pnpx nozo init
```

This adds `@nozomiishii/prettier-config` and `prettier` to your
`devDependencies` (pinned), sets `"type": "module"`, adds `format` /
`format:fix` / `prettier` scripts, and writes a `prettier.config.ts` that
re-exports the shared config.
It also adds `**/routeTree.gen.ts` to `.prettierignore`.

## Included Plugins

- [prettier-plugin-packagejson](https://www.npmjs.com/package/prettier-plugin-packagejson)

## Policy

### File exclusion

A [shareable config](https://prettier.io/docs/sharing-configurations/) only
provides regular Prettier options and cannot set a file's ignore status.
Following [Prettier's official ignore mechanism](https://prettier.io/docs/ignore/),
the init command appends `**/routeTree.gen.ts` to the consumer root's
`.prettierignore` without replacing existing content. This follows
[TanStack Router's guidance to exclude its generated route tree](https://tanstack.com/router/latest/docs/framework/react/installation/with-router-cli#ignoring-the-generated-route-tree-file).
The CLI and editors exclude the file, and
`prettier --file-info src/routeTree.gen.ts` returns `ignored: true`.

For an existing project, rerun `pnpx nozo init` or add
`**/routeTree.gen.ts` to `.prettierignore` manually. If the project passes
`--ignore-path`, it [replaces the default ignore file lookup](https://prettier.io/docs/cli#--ignore-path).
Remove the option or pass both `.gitignore` and `.prettierignore`.

`pnpm-lock.yaml`, `submodules/**`, `next-env.d.ts`, `*.md`, `*.mdx`, and
`**/.claude/settings.json` use `requirePragma: true` overrides in the shared
config, so they are not formatted without a pragma. The same override remains
for `**/routeTree.gen.ts` as a compatibility fallback for projects that have
not migrated yet.

`**/.claude/settings.json` also needs `parser: jsonc`: Claude Code writes it
with multi-line arrays, and the `json` parser ignores `requirePragma` while
`jsonc` honors it.

The Prettier 3.6 `checkIgnorePragma` option
(`@noformat` / `@noprettier`) is not adopted: it adds another opt-out surface
without a need for one.

### Experimental options

Prettier's `experimental*` options (e.g. `experimentalOperatorPosition`,
`experimentalTernaries`) are **not** adopted, now or in the future. We
wait for them to stabilize and become defaults. Formatting is fine as
long as it's consistent — there is no value in chasing experimental
output changes.

### Future migration to oxfmt

We intend to migrate to [oxfmt](https://oxc.rs/) (Prettier-compatible
formatter from the OXC project) eventually. The trigger is **when oxlint
has fully absorbed ESLint's rule set**. Until then we stay on Prettier.

Because oxfmt is designed to accept Prettier's config as-is, the
settings in this package are expected to carry over without changes.
Adding non-essential Prettier plugins increases future migration cost
and is avoided.
