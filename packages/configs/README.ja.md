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
- 下の設定ファイルを書く
- スキャフォールドが書く scripts を足す

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

利用先の `node_modules` 直下に巻き上げる設定は要らない。

## 設定ファイル

`eslint.config.ts`。preset は `nextjs` と `tanstack-start` と `node` から選ぶ:

```ts
import { defineConfig, nextjs } from "@nozomiishii/configs/eslint";

export default defineConfig([...nextjs()]);
```

`commitlint.config.ts`:

```ts
export default { extends: ["@nozomiishii/configs/commitlint"] };
```

`oxfmt.config.ts`:

```ts
export { default } from "@nozomiishii/configs/oxfmt";
```

`lefthook.yaml`。lefthook の `extends` はパッケージ名ではなく、repo ルートからのパスで読む:

```yaml
extends:
  - ./node_modules/@nozomiishii/configs/recommended.yaml
```

`tsconfig.json`。ファイル名は `base` と `lib` と `nextjs` と `tanstack-start` と `tsc` から選ぶ:

```json
{
  "extends": "@nozomiishii/configs/tsconfig/nextjs.json"
}
```

## bin

| bin | 実行するもの |
| --- | --- |
| `commitlint`、`nozo-commitlint` | 同梱 config での commitlint |
| `nozo-git-harvest` | merge 済みの worktree と branch の掃除 |
| `postinstall` | repo のセットアップ |
| `nozo-configs-init` | この一式を今のプロジェクトに書き込む |

## License

MIT
