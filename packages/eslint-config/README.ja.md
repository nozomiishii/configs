# @nozomiishii/eslint-config

[English](./README.md) | 日本語

共通の [eslint](https://eslint.org/) 設定。

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/FHEjBpiqMwSuA/giphy.gif" alt="Coding" width="480" />
</div>
<div align="right">
  <small>via GIPHY</small>
</div>
<br>

## インストール

[`nozo`](../nozo) CLI を使う:

```bash
pnpx nozo init
```

これで `@nozomiishii/eslint-config` / `eslint` / `typescript` が pin で `devDependencies` に追加され、`eslint` / `lint` / `lint:fix` の scripts が追加され、選んだ preset を compose する `eslint.config.ts` が生成される。

preset は2つから選ぶ:

- `nextjs`: React / Next.js / Tailwind / Storybook 込みの web アプリ向け
- `node`: CLI / ライブラリ向け（web 系を除いた Node.js 構成）

## preset

`node` と `nextjs` は共有の `base`（フレームワーク・ランタイム非依存の言語土台）を元に組み、末尾でそれぞれ prettier を一度だけ付ける。生成された `eslint.config.ts` は選んだ preset を spread する:

```ts
import { defineConfig, node } from "@nozomiishii/eslint-config";

export default defineConfig([...node()]);
```

`base()` は共有の土台として export している（prettier は含めず、node / nextjs が付ける）。`node()` は Node.js 層、`nextjs()` は Node.js 層 + web 層を足す。

## ルール一覧

このパッケージで有効な config と rule を [`@eslint/config-inspector`](https://github.com/eslint/config-inspector) でブラウズできる:

<https://nozomiishii.github.io/configs/eslint/>

## 参考

- [sxzz/eslint-config](https://github.com/sxzz/eslint-config)
- [antfu/eslint-config](https://github.com/antfu/eslint-config)
- [azat-io/eslint-config](https://github.com/azat-io/eslint-config)
- [EvgenyOrekhov/eslint-config-hardcore](https://github.com/EvgenyOrekhov/eslint-config-hardcore)
- [kazupon/eslint-config](https://github.com/kazupon/eslint-config)
- [AkaraChen/eslint-config](https://github.com/AkaraChen/eslint-config)
- [eslint-react/examples/next-app](https://github.com/Rel1cx/eslint-react/blob/2.0.0-next/examples/next-app/eslint.config.js)
- [vercel/style-guide](https://github.com/vercel/style-guide)
- [airbnb/javascript](https://github.com/airbnb/javascript)
