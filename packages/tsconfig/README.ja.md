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

- [`@nozomiishii/tsconfig`](./src/tsconfig.json) — base プリセット (`module: "preserve"` + `noEmit: true` + strict 系)。tsup / tsdown / esbuild など bundler が emit するワークフロー向けで、tsc は typecheck 専用。
- [`@nozomiishii/tsconfig/tsconfig.tsc.json`](./src/tsconfig.tsc.json) — `tsc` で transpile する場合 (`NodeNext` + `outDir` + sourceMap)。
- [`@nozomiishii/tsconfig/tsconfig.lib.json`](./src/tsconfig.lib.json) — ライブラリ向け (`declaration` + `isolatedDeclarations`)。
- [`@nozomiishii/tsconfig/tsconfig.nextjs.json`](./src/tsconfig.nextjs.json) — Next.js 向け (`jsx` + Next.js plugin など)。
- [`@nozomiishii/tsconfig/tsconfig.tanstack-start.json`](./src/tsconfig.tanstack-start.json) — Vite を使う TanStack Start 向け (`react-jsx` + DOM + Vite client types)。

各オプションの選定理由は [docs/プリセットの選定理由.md](./docs/プリセットの選定理由.md) を参照。

extends したあとに `include` / `exclude` / `baseUrl` などプロジェクト固有設定を足す:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@nozomiishii/tsconfig/tsconfig.json",
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 参考

- [The TSConfig Cheat Sheet](https://www.totaltypescript.com/tsconfig-cheat-sheet)
- [tsconfig/bases](https://github.com/tsconfig/bases)
- [sindresorhus/tsconfig](https://github.com/sindresorhus/tsconfig)
- [TypeScriptの設定の良し悪し](https://gist.github.com/azu/56a0411d69e2fc333d545bfe57933d07)
