# @nozomiishii/tsconfig

English | [日本語](./README.ja.md)

Shared [tsconfig](https://www.typescriptlang.org/tsconfig).

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/zWpm4CRynyYrC/giphy.gif" alt="Coding" width="480" />
</div>
<div align="right">
  <small>via GIPHY</small>
</div>
<br>

## Install

```bash
pnpm add -D @nozomiishii/tsconfig
```

## Usage

Pick the variant for your setup. Each file is a working `tsconfig` you can `extends`:

- [`@nozomiishii/tsconfig`](./tsconfig.json) — base preset (`module: "preserve"` + strict defaults).
- [`@nozomiishii/tsconfig/tsconfig.bundler.json`](./tsconfig.bundler.json) — for tsup / tsdown / esbuild and other bundlers (`noEmit: true`).
- [`@nozomiishii/tsconfig/tsconfig.tsc.json`](./tsconfig.tsc.json) — for `tsc` transpile (`NodeNext` + `outDir` + sourceMap).
- [`@nozomiishii/tsconfig/tsconfig.lib.json`](./tsconfig.lib.json) — for libraries (`declaration` + `isolatedDeclarations`).
- [`@nozomiishii/tsconfig/tsconfig.nextjs.json`](./tsconfig.nextjs.json) — for Next.js (`jsx` + Next.js plugin, etc.).

After extending, add your own `include` / `exclude` / `baseUrl`:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@nozomiishii/tsconfig/tsconfig.bundler.json",
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## References

- [The TSConfig Cheat Sheet](https://www.totaltypescript.com/tsconfig-cheat-sheet)
- [tsconfig/bases](https://github.com/tsconfig/bases)
- [sindresorhus/tsconfig](https://github.com/sindresorhus/tsconfig)
- [TypeScriptの設定の良し悪し](https://gist.github.com/azu/56a0411d69e2fc333d545bfe57933d07)
