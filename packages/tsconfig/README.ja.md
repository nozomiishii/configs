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

セットアップに近い例を選び、その `tsconfig.json` をコピーして使う:

- [**Bundler** (tsup / tsdown / esbuild など)](./examples/bundler/tsconfig.json) — base が `module: "preserve"` (TS 5.4+) を提供するため、追加設定は最小限で済む。
- [**tsc**](./examples/tsc/tsconfig.json) — base の `module: "preserve"` を `NodeNext` で上書き。
- [**Next.js**](./examples/nextjs/tsconfig.json) — `@nozomiishii/tsconfig/tsconfig.nextjs.json` を extend する形。
- [**ライブラリ** （tsdown / tsup 等で `.d.ts` を並列生成する場合）](./examples/library/tsconfig.json) — `isolatedDeclarations: true` + `declaration: true` を有効化したプリセット。

## 参考

- [The TSConfig Cheat Sheet](https://www.totaltypescript.com/tsconfig-cheat-sheet)
- [tsconfig/bases](https://github.com/tsconfig/bases)
- [sindresorhus/tsconfig](https://github.com/sindresorhus/tsconfig)
- [TypeScriptの設定の良し悪し](https://gist.github.com/azu/56a0411d69e2fc333d545bfe57933d07)
