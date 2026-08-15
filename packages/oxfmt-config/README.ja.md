# @nozomiishii/oxfmt-config

[English](./README.md) | 日本語

共通の [oxfmt](https://oxc.rs/docs/guide/usage/formatter) 設定。

## インストール

[`nozo`](../nozo) CLI を使う:

```bash
pnpx nozo init
```

## Prettier からの違い

- JSONC / JSON5 の `trailingComma: none` は移さない。VS Code の
  `settings.json` は oxfmt が末尾カンマを付けない。
- `prettier-plugin-packagejson` と `package.json` の並び順は一致しない。
- Ruby は oxfmt の対象外。

対応言語は[公式一覧](https://oxc.rs/docs/guide/usage/formatter/language-support)を参照。

## License

MIT
