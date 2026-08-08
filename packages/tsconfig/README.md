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

- [`@nozomiishii/tsconfig`](./src/tsconfig.json) — base preset (`module: "preserve"` + `noEmit: true` + strict defaults). Built for workflows where tsup / tsdown / esbuild or another bundler emits and `tsc` only typechecks.
- [`@nozomiishii/tsconfig/tsconfig.tsc.json`](./src/tsconfig.tsc.json) — for `tsc` transpile (`NodeNext` + `outDir` + sourceMap).
- [`@nozomiishii/tsconfig/tsconfig.lib.json`](./src/tsconfig.lib.json) — for libraries (`declaration` + `isolatedDeclarations`).
- [`@nozomiishii/tsconfig/tsconfig.nextjs.json`](./src/tsconfig.nextjs.json) — for Next.js (`jsx` + Next.js plugin, etc.).
- [`@nozomiishii/tsconfig/tsconfig.tanstack-start.json`](./src/tsconfig.tanstack-start.json) — for TanStack Start with Vite (`react-jsx` + DOM + Vite client types).

The reasoning behind each option is documented in [docs/プリセットの選定理由.md](./docs/プリセットの選定理由.md) (Japanese).

After extending, add your own `include` / `exclude` / `baseUrl`:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@nozomiishii/tsconfig/tsconfig.json",
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## References

- [The TSConfig Cheat Sheet](https://www.totaltypescript.com/tsconfig-cheat-sheet)
- [tsconfig/bases](https://github.com/tsconfig/bases)
- [sindresorhus/tsconfig](https://github.com/sindresorhus/tsconfig)
- [TypeScriptの設定の良し悪し](https://gist.github.com/azu/56a0411d69e2fc333d545bfe57933d07)
