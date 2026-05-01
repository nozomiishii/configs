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
    // TSC で Transpile する場合
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

### library (tsdown / tsup 等で `.d.ts` を並列生成する場合)

`isolatedDeclarations: true` + `declaration: true` を有効化したプリセット。`tsc` 以外のツールで型定義ファイルを高速生成したいライブラリ向け。

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

## 参考

- [The TSConfig Cheat Sheet](https://www.totaltypescript.com/tsconfig-cheat-sheet)
- [tsconfig/bases](https://github.com/tsconfig/bases)
- [sindresorhus/tsconfig](https://github.com/sindresorhus/tsconfig)
- [TypeScriptの設定の良し悪し](https://gist.github.com/azu/56a0411d69e2fc333d545bfe57933d07)
