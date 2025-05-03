# @nozomiishii/postinstall

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

```bash
pnpm add -D @nozomiishii/postinstall
```

## Usage

Add this package to your project's postinstall script using pnpm CLI

```bash
pnpm pkg set scripts.postinstall="postinstall"
```

Your package.json should contain this configuration

`package.json`

```json
{
  "postinstall": "postinstall"
}
```

Run install to trigger the postinstall script which sets up development tools

```bash
pnpm install
```
