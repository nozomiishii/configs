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

Pick the example closest to your setup and copy its `tsconfig.json`:

- [**Bundler** (tsup / tsdown / esbuild, …)](./examples/bundler/tsconfig.json) — the base provides `module: "preserve"` (TS 5.4+), so additional config stays minimal.
- [**tsc**](./examples/tsc/tsconfig.json) — overrides the base `module: "preserve"` with `NodeNext`.
- [**Next.js**](./examples/nextjs/tsconfig.json) — extends `@nozomiishii/tsconfig/tsconfig.nextjs.json`.
- [**Library** (`.d.ts` alongside builds with tsdown / tsup, etc.)](./examples/library/tsconfig.json) — preset with `isolatedDeclarations: true` + `declaration: true` enabled.

## References

- [The TSConfig Cheat Sheet](https://www.totaltypescript.com/tsconfig-cheat-sheet)
- [tsconfig/bases](https://github.com/tsconfig/bases)
- [sindresorhus/tsconfig](https://github.com/sindresorhus/tsconfig)
- [TypeScriptの設定の良し悪し](https://gist.github.com/azu/56a0411d69e2fc333d545bfe57933d07)
