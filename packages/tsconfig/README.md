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

`tsconfig.json`

### tsup / tsdown / esbuild and other bundlers

The base provides `module: "preserve"` (TS 5.4+), so bundler-based setups need minimal additional config.

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@nozomiishii/tsconfig",

  "compilerOptions": {
    "noEmit": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### tsc

Override the base `module: "preserve"` with `NodeNext`.

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@nozomiishii/tsconfig",
  "compilerOptions": {
    // ----------------------------------------------------------------
    // Transpiling
    // ----------------------------------------------------------------
    // When transpiling with TSC
    "moduleResolution": "NodeNext",
    "module": "NodeNext",
    "outDir": "dist",
    "sourceMap": true
  }
}
```

### nextjs

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@nozomiishii/tsconfig/tsconfig.nextjs.json",
  "compilerOptions": {
    "baseUrl": "."
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### library (generating `.d.ts` in parallel with tsdown / tsup, etc.)

A preset with `isolatedDeclarations: true` + `declaration: true` enabled. For libraries that want to generate type definition files quickly with tools other than `tsc`.

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@nozomiishii/tsconfig/tsconfig.lib.json",
  "compilerOptions": {
    "moduleResolution": "Bundler",
    "module": "ESNext",
    "outDir": "dist",
    "noEmit": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## References

- [The TSConfig Cheat Sheet](https://www.totaltypescript.com/tsconfig-cheat-sheet)
- [tsconfig/bases](https://github.com/tsconfig/bases)
- [sindresorhus/tsconfig](https://github.com/sindresorhus/tsconfig)
- [TypeScriptの設定の良し悪し](https://gist.github.com/azu/56a0411d69e2fc333d545bfe57933d07)
