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
