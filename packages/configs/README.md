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
- add `@nozomiishii/*` to `publicHoistPattern` (see below)
- copy the config files from each package listed above
- add the scripts that the child scaffolders write

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

pnpm 11 or newer is required. pnpm reads `publicHoistPattern` only from `pnpm-workspace.yaml`, not
from `.npmrc`.

pnpm keeps the child packages out of the consumer's `node_modules` root, so the `nozo-commitlint`,
`nozo-git-harvest` and `postinstall` bins and the lefthook hooks under
`node_modules/@nozomiishii/lefthook-config/hooks` are unreachable without hoisting them:

```yaml
# pnpm-workspace.yaml
publicHoistPattern:
  - "@nozomiishii/*"
```

## tsconfig

`@nozomiishii/tsconfig` has no scaffolder. Extend it from the project's tsconfig.json:

```json
{
  "extends": "@nozomiishii/tsconfig/tsconfig.json"
}
```

## License

MIT
