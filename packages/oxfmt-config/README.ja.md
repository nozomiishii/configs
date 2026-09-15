# @nozomiishii/oxfmt-config

[English](./README.md) | 日本語

共通の [oxfmt](https://oxc.rs/docs/guide/usage/formatter) 設定。

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/UdnRoDDuL5Ws8/giphy.gif" alt="Coding" width="480" />
</div>
<br>

## インストール

[`nozo`](../nozo) CLI を使う:

```bash
pnpx nozo init
```

## カスタマイズ

設定を上書きするときは、`oxfmt.config.ts` を oxfmt の `defineConfig` で書き換えると、型注釈なしで補完と型チェックが効く。

```typescript
import nozomiishii from "@nozomiishii/oxfmt-config";
import { defineConfig } from "oxfmt";

export default defineConfig({
  ...nozomiishii,
  // 上書きしたい設定をここに書く
});
```

## License

MIT
