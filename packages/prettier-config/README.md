# @nozomiishii/prettier-config

English | [日本語](./README.ja.md)

Shareable [Prettier](https://prettier.io) config.

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

```bash
pnpx @nozomiishii/prettier-config@latest
```

## Manual

```bash
pnpm add -D @nozomiishii/prettier-config
```

Add the scripts:

```bash
npm pkg set type="module"
npm pkg set scripts.format="pnpm prettier --check"
npm pkg set scripts.format:fix="pnpm prettier --write"
npm pkg set scripts.prettier="prettier . --ignore-unknown"
```

`package.json`

```json
{
  "type": "module",
  "scripts": {
    "format": "pnpm prettier --check",
    "format:fix": "pnpm prettier --write",
    "prettier": "prettier . --ignore-unknown"
  }
}
```

`prettier.config.js`

```js
export { default } from '@nozomiishii/prettier-config';
```

## Included Plugins

- [prettier-plugin-packagejson](https://www.npmjs.com/package/prettier-plugin-packagejson)
