# @nozomiishii/configs

English | [日本語](./README.ja.md)

The recommended config set as a single devDependency.

## Included

| package | role |
| --- | --- |
| [@nozomiishii/commitlint-config](../commitlint-config) | Conventional Commits with scope enforcement |
| [@nozomiishii/eslint-config](../eslint-config) | ESLint flat config preset |
| [@nozomiishii/lefthook-config](../lefthook-config) | Git hooks preset |
| [@nozomiishii/oxfmt-config](../oxfmt-config) | oxfmt preset |
| [@nozomiishii/postinstall](../postinstall) | postinstall scaffolder |
| [@nozomiishii/tsconfig](../tsconfig) | TSConfig preset |

Prettier, cSpell and markdownlint are not part of the set. Install
[@nozomiishii/prettier-config](../prettier-config),
[@nozomiishii/cspell-config](../cspell-config) and
[@nozomiishii/markdownlint-cli2-config](../markdownlint-cli2-config) directly if you want them.

## Install

Use the [`nozo`](../nozo) CLI:

```bash
pnpx nozo init
```

Manual setup:

- add the dependency and its peers: `pnpm add -D @nozomiishii/configs eslint typescript lefthook oxfmt`
- write the config files below
- add the scripts that the scaffolder writes

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

Nothing has to be hoisted into the consumer's `node_modules` root.

## Config files

`eslint.config.ts`, with `nextjs`, `tanstack-start` or `node` as the preset:

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

`lefthook.yaml`. lefthook reads `extends` as a path from the repository root, not as a package
name:

```yaml
extends:
  - ./node_modules/@nozomiishii/configs/recommended.yaml
```

`tsconfig.json`, with `base`, `lib`, `nextjs`, `tanstack-start` or `tsc` as the file name:

```json
{
  "extends": "@nozomiishii/configs/tsconfig/nextjs.json"
}
```

## Bins

| bin | what it runs |
| --- | --- |
| `commitlint`, `nozo-commitlint` | commitlint with the bundled config |
| `nozo-git-harvest` | cleanup of merged worktrees and branches |
| `postinstall` | repository bootstrap |
| `nozo-configs-init` | writes this set into the current project |

## License

MIT
