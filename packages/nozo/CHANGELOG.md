# Changelog

## [1.0.0](https://github.com/nozomiishii/configs/compare/nozo-v0.4.4...nozo-v1.0.0) (2026-05-08)


### Miscellaneous

* graduate to v1.0.0 with linked-versions ([#2202](https://github.com/nozomiishii/configs/issues/2202)) ([8444f14](https://github.com/nozomiishii/configs/commit/8444f143146fb6fba37cfce1a0d41d64836e4dda))
* revert phase 5 to redesign linked-versions strategy ([#2206](https://github.com/nozomiishii/configs/issues/2206)) ([511ab9f](https://github.com/nozomiishii/configs/commit/511ab9fd62f158cdf2d36faa60b16c3ad710f273))

## [0.4.4](https://github.com/nozomiishii/configs/compare/nozo-v0.4.3...nozo-v0.4.4) (2026-05-08)

### Features

- **nozo:** switch init command to spawn dispatcher and cover all configs ([#2192](https://github.com/nozomiishii/configs/issues/2192)) ([41e25b1](https://github.com/nozomiishii/configs/commit/41e25b13fbaa496e9294e6398cfb5aeecce12577))

### Miscellaneous

- update pnpm to v10.33.3 ([#2199](https://github.com/nozomiishii/configs/issues/2199)) ([6d610b4](https://github.com/nozomiishii/configs/commit/6d610b4ae99a16216c70737e5398d1670725e110))
- update pnpm to v11 ([#2193](https://github.com/nozomiishii/configs/issues/2193)) ([e7c39d1](https://github.com/nozomiishii/configs/commit/e7c39d1183234ec9ebf2d8599535279b970222e9))

## [0.4.3](https://github.com/nozomiishii/configs/compare/nozo-v0.4.2...nozo-v0.4.3) (2026-05-07)

### Miscellaneous

- update dependency eslint to v10.3.0 ([#2185](https://github.com/nozomiishii/configs/issues/2185)) ([0ecb904](https://github.com/nozomiishii/configs/commit/0ecb9046e502ed3af729586f4023e32382a864cd))

## [0.4.2](https://github.com/nozomiishii/configs/compare/nozo-v0.4.1...nozo-v0.4.2) (2026-05-03)

### Miscellaneous

- update dependency @clack/prompts to v1.3.0 ([#2166](https://github.com/nozomiishii/configs/issues/2166)) ([09f6f2b](https://github.com/nozomiishii/configs/commit/09f6f2bedee6428bf77539b3689786076b947eb7))

## [0.4.1](https://github.com/nozomiishii/configs/compare/nozo-v0.4.0...nozo-v0.4.1) (2026-05-02)

### Features

- **nozo:** implement init command for lefthook scaffolding ([#2157](https://github.com/nozomiishii/configs/issues/2157)) ([85a00fe](https://github.com/nozomiishii/configs/commit/85a00febcfbea39e04a1283c54683e1265b37660))

## [0.4.0](https://github.com/nozomiishii/configs/compare/nozo-v0.3.0...nozo-v0.4.0) (2026-05-01)

### ⚠ BREAKING CHANGES

- **prettier-config:** The singleQuote default is changed from true to false. Consumer repositories will see string literals re-formatted from single to double quotes.

### Features

- **prettier-config:** revert singleQuote to Prettier default ([#2140](https://github.com/nozomiishii/configs/issues/2140)) ([c2f2ff5](https://github.com/nozomiishii/configs/commit/c2f2ff5ef8f68d53e7caf67206e95b8c16a10037))

### Bug Fixes

- add Japanese READMEs for shared config packages ([#2151](https://github.com/nozomiishii/configs/issues/2151)) ([b5e96f1](https://github.com/nozomiishii/configs/commit/b5e96f1cb4ad35725b44cf9b19cd01b02d798fa9))

## [0.3.0](https://github.com/nozomiishii/configs/compare/nozo-v0.2.2...nozo-v0.3.0) (2026-04-28)

### ⚠ BREAKING CHANGES

- bin field changes from a single setup script ("bin": "bin/cli.sh") to a namespaced map ({ "nozo-commitlint": "bin/cli.mjs" }). Consumers who previously ran pnpx @nozomiishii/commitlint-config@latest to scaffold a commitlint config now need a different mechanism (planned for nozo init in a follow-up PR).

### Features

- modularize lefthook config + commitlint shim + nozo CLI rebuild ([#2119](https://github.com/nozomiishii/configs/issues/2119)) ([1140b62](https://github.com/nozomiishii/configs/commit/1140b62e3d0430f2383a5f683ea2583fa4ea7ee9)), closes [#2118](https://github.com/nozomiishii/configs/issues/2118)

## [0.2.2](https://github.com/nozomiishii/configs/compare/nozo-v0.2.1...nozo-v0.2.2) (2026-04-27)

### Miscellaneous

- release main ([#2031](https://github.com/nozomiishii/configs/issues/2031)) ([ba1c8b0](https://github.com/nozomiishii/configs/commit/ba1c8b0d0373eb1cc65bc89702ba1a41f5923e6b))
- update Node.js version to 24.11.0 ([dfe7067](https://github.com/nozomiishii/configs/commit/dfe70673dea75db5967d267483aa03c99bc14630))

## [0.2.1](https://github.com/nozomiishii/configs/compare/nozo-v0.2.0...nozo-v0.2.1) (2025-08-21)

### Bug Fixes

- devEngines in package.json ([02d57a3](https://github.com/nozomiishii/configs/commit/02d57a31f4d4d403b14ad223661c9531faeda296))
- remove pnpm.executionEnv.nodeVersion ([9e2941a](https://github.com/nozomiishii/configs/commit/9e2941a0b00a83a5dc00391a533eccd3dd9b7824))

## [0.2.0](https://github.com/nozomiishii/configs/compare/nozo-v0.1.0...nozo-v0.2.0) (2023-08-06)

### Features

- add initial CHANGELOG ([9ce8c62](https://github.com/nozomiishii/configs/commit/9ce8c62626daccb52d6855312820188fbb069a18))
