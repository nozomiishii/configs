# @nozomiishii/postinstall

English | [日本語](./README.ja.md)

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/z5pDjpG4FZZXDVNb9X/giphy.gif" alt="Coding" width="480" />
</div>
<div align="right">
  <small>via GIPHY</small>
</div>
<br>

## Install

Use the [`nozo`](../nozo) CLI:

```bash
pnpx nozo init
```

This adds `@nozomiishii/postinstall` to your `devDependencies` (pinned)
and sets `scripts.postinstall` to `"postinstall"` so the package's
postinstall script runs on every `pnpm install`.

`package.json`

```json
{
  "scripts": {
    "postinstall": "postinstall"
  }
}
```
