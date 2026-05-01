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

```bash
pnpm add -D @nozomiishii/postinstall
```

## 使い方

pnpm CLI でこのパッケージをプロジェクトの postinstall スクリプトに追加します:

```bash
pnpm pkg set scripts.postinstall="postinstall"
```

`package.json` は次の設定を含むはずです:

`package.json`

```json
{
  "postinstall": "postinstall"
}
```

`pnpm install` を実行すると postinstall スクリプトが起動し、開発ツールがセットアップされます:

```bash
pnpm install
```
