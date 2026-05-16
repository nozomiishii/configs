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

## Included Plugins

- [prettier-plugin-packagejson](https://www.npmjs.com/package/prettier-plugin-packagejson)

## Policy

### File exclusion: `requirePragma` over `.prettierignore`

Files that should never be formatted (`pnpm-lock.yaml`, `submodules/**`,
`next-env.d.ts`, `*.md`, `*.mdx`) are excluded via `requirePragma: true`
overrides in this config rather than a `.prettierignore` file.

A `.prettierignore` would duplicate patterns already in `.gitignore` and
invite drift between the two. Prettier 3.x already honors `.gitignore`
automatically, so most ignore needs are covered without a dedicated file.

For the same reason, the Prettier 3.6 `checkIgnorePragma` option
(`@noformat` / `@noprettier`) is **not** adopted: it adds another opt-out
surface without removing the `.prettierignore` problem.

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
