# @nozomiishii/tsconfig

[English](./README.md) | 日本語

共通の [tsconfig](https://www.typescriptlang.org/tsconfig)。

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/zWpm4CRynyYrC/giphy.gif" alt="Coding" width="480" />
</div>
<div align="right">
  <small>via GIPHY</small>
</div>
<br>

## インストール

```bash
pnpm add -D @nozomiishii/tsconfig
```

## 使い方

セットアップに合った variant を選んで `extends` する。各ファイル自体がそのまま動く `tsconfig` 実例を兼ねている:

- [`@nozomiishii/tsconfig`](./tsconfig.json) — base プリセット (`module: "preserve"` + strict 系)。
- [`@nozomiishii/tsconfig/tsconfig.bundler.json`](./tsconfig.bundler.json) — tsup / tsdown / esbuild など bundler 系向け (`noEmit: true`)。
- [`@nozomiishii/tsconfig/tsconfig.tsc.json`](./tsconfig.tsc.json) — `tsc` で transpile する場合 (`NodeNext` + `outDir` + sourceMap)。
- [`@nozomiishii/tsconfig/tsconfig.lib.json`](./tsconfig.lib.json) — ライブラリ向け (`declaration` + `isolatedDeclarations`)。
- [`@nozomiishii/tsconfig/tsconfig.nextjs.json`](./tsconfig.nextjs.json) — Next.js 向け (`jsx` + Next.js plugin など)。

extends したあとに `include` / `exclude` / `baseUrl` などプロジェクト固有設定を足す:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@nozomiishii/tsconfig/tsconfig.bundler.json",
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 参考

- [The TSConfig Cheat Sheet](https://www.totaltypescript.com/tsconfig-cheat-sheet)
- [tsconfig/bases](https://github.com/tsconfig/bases)
- [sindresorhus/tsconfig](https://github.com/sindresorhus/tsconfig)
- [TypeScriptの設定の良し悪し](https://gist.github.com/azu/56a0411d69e2fc333d545bfe57933d07)
