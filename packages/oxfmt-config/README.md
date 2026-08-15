# @nozomiishii/oxfmt-config

English | [日本語](./README.ja.md)

Shared [oxfmt](https://oxc.rs/docs/guide/usage/formatter) config.

## Install

Use the [`nozo`](../nozo) CLI:

```bash
pnpx nozo init
```

## Differences from Prettier

- The JSONC / JSON5 `trailingComma: none` override is not carried over.
  oxfmt does not add trailing commas to VS Code `settings.json` files.
- `prettier-plugin-packagejson` and oxfmt use different `package.json` ordering.
- Ruby is not supported by oxfmt.

See the official [language support](https://oxc.rs/docs/guide/usage/formatter/language-support)
list for other formats.

## License

MIT
