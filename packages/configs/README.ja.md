# @nozomiishii/configs

[English](./README.md) | 日本語

おすすめ一式を devDependencies 1 行で入れるためのパッケージ。

## 含まれるもの

| パッケージ | 役割 |
| --- | --- |
| [@nozomiishii/commitlint-config](../commitlint-config) | Conventional Commits + scope 強制 |
| [@nozomiishii/eslint-config](../eslint-config) | ESLint flat config preset |
| [@nozomiishii/lefthook-config](../lefthook-config) | Git hooks preset |
| [@nozomiishii/oxfmt-config](../oxfmt-config) | oxfmt preset |
| [@nozomiishii/postinstall](../postinstall) | postinstall scaffolder |
| [@nozomiishii/tsconfig](../tsconfig) | TSConfig preset |

Prettier と cSpell と markdownlint は一式に含めない。要るときは
[@nozomiishii/prettier-config](../prettier-config)、
[@nozomiishii/cspell-config](../cspell-config)、
[@nozomiishii/markdownlint-cli2-config](../markdownlint-cli2-config) を個別に入れる。

## インストール

[`nozo`](../nozo) CLI を使う:

```bash
pnpx nozo init
```

手動で入れる場合:

- 依存と peer を足す: `pnpm add -D @nozomiishii/configs eslint typescript lefthook oxfmt`
- `publicHoistPattern` に `@nozomiishii/*` を足す (下記)
- 上の各パッケージから設定ファイルを写す
- 子パッケージのスキャフォールドが書く scripts を足す

```json
{
  "scripts": {
    "eslint": "eslint --max-warnings=0 --cache",
    "format": "pnpm oxfmt . --check",
    "format:fix": "pnpm oxfmt .",
    "lint": "pnpm eslint",
    "lint:fix": "pnpm eslint --fix",
    "oxfmt": "oxfmt --no-error-on-unmatched-pattern",
    "postinstall": "postinstall"
  }
}
```

## pnpm

pnpm 11 以上が要る。pnpm は `publicHoistPattern` を `.npmrc` からは読まず、`pnpm-workspace.yaml`
からだけ読む。

pnpm は子パッケージを利用先の `node_modules` 直下に置かないため、hoist しないと `nozo-commitlint`、
`nozo-git-harvest`、`postinstall` の bin と
`node_modules/@nozomiishii/lefthook-config/hooks` の lefthook hooks に届かない:

```yaml
# pnpm-workspace.yaml
publicHoistPattern:
  - "@nozomiishii/*"
```

## tsconfig

`@nozomiishii/tsconfig` にはスキャフォールドが無い。プロジェクトの tsconfig.json から extends する:

```json
{
  "extends": "@nozomiishii/tsconfig/tsconfig.json"
}
```

## License

MIT
