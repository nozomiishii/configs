# @nozomiishii/oxfmt-config

English | [日本語](./README.ja.md)

Shared [oxfmt](https://oxc.rs/docs/guide/usage/formatter) config.

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/UdnRoDDuL5Ws8/giphy.gif" alt="Coding" width="480" />
</div>
<br>

## Install

Use the [`nozo`](../nozo) CLI:

```bash
pnpx nozo init
```

## Customize

To override settings, rewrite `oxfmt.config.ts` with oxfmt's `defineConfig` to get autocomplete and type checking without type annotations.

```typescript
import config from "@nozomiishii/oxfmt-config";
import { defineConfig } from "oxfmt";

export default defineConfig({
  ...config,
  // Add your overrides here
});
```

## License

MIT
