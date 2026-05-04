# @nozomiishii/postinstall

[English](./README.md) | 日本語

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/z5pDjpG4FZZXDVNb9X/giphy.gif" alt="Coding" width="480" />
</div>
<div align="right">
  <small>via GIPHY</small>
</div>
<br>

## インストール

[`nozo`](../nozo) CLI を使う:

```bash
pnpx nozo init
```

これで `@nozomiishii/postinstall` が pin で `devDependencies` に追加され、`scripts.postinstall` が `"postinstall"` に設定される（毎回の `pnpm install` 時に本パッケージの postinstall スクリプトが起動する）。

`package.json`

```json
{
  "scripts": {
    "postinstall": "postinstall"
  }
}
```
