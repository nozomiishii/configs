# @nozomiishii/tsconfig

Nozomi's Recommended [tsconfig](https://www.typescriptlang.org/tsconfig)

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

### tsup / tsdown / esbuild など bundler 系

base が `module: "preserve"` (TS 5.4+) を提供するため、bundler 系では追加設定は最小限で済む。

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

base の `module: "preserve"` を `NodeNext` で上書きする。

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@nozomiishii/tsconfig",
  "compilerOptions": {
    // ----------------------------------------------------------------
    // Transpiling
    // ----------------------------------------------------------------
    // TSCでTranspileする場合
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

## References

- [The TSConfig Cheat Sheet](https://www.totaltypescript.com/tsconfig-cheat-sheet)
- [tsconfig/bases](https://github.com/tsconfig/bases)
- [sindresorhus/tsconfig](https://github.com/sindresorhus/tsconfig)
- [TypeScriptの設定の良し悪し](https://gist.github.com/azu/56a0411d69e2fc333d545bfe57933d07)
