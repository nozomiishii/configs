# Changelog

## [0.2.1](https://github.com/nozomiishii/configs/compare/@nozomiishii/commitlint-config-v0.2.0...@nozomiishii/commitlint-config-v0.2.1) (2026-05-03)


### Miscellaneous

* update commitlint monorepo to v20.5.3 ([#2170](https://github.com/nozomiishii/configs/issues/2170)) ([8eb0b69](https://github.com/nozomiishii/configs/commit/8eb0b6905c47b47fe993d6ace97c154f1a31f1b1))

## [0.2.0](https://github.com/nozomiishii/configs/compare/@nozomiishii/commitlint-config-v0.1.0...@nozomiishii/commitlint-config-v0.2.0) (2026-05-01)

### ⚠ BREAKING CHANGES

- **commitlint-config:** rule renamed from `body-ascii-only` to `commit-message-ascii-only`. The new rule also fires when non-ASCII appears in the footer or in note text, not just the body.
- **commitlint-config:** rule renamed from `body-ascii-only` to `commit-message-ascii-only`. The new rule also fires when non-ASCII appears in the footer or in note text, not just the body.
- **prettier-config:** The singleQuote default is changed from true to false. Consumer repositories will see string literals re-formatted from single to double quotes.

### Features

- **commitlint-config:** rename body-ascii-only to commit-message-ascii-only ([#2147](https://github.com/nozomiishii/configs/issues/2147)) ([fc1bbf9](https://github.com/nozomiishii/configs/commit/fc1bbf95213eff33e03c842473bb84c516cef5bf))
- **prettier-config:** revert singleQuote to Prettier default ([#2140](https://github.com/nozomiishii/configs/issues/2140)) ([c2f2ff5](https://github.com/nozomiishii/configs/commit/c2f2ff5ef8f68d53e7caf67206e95b8c16a10037))

### Bug Fixes

- add Japanese READMEs for shared config packages ([#2151](https://github.com/nozomiishii/configs/issues/2151)) ([b5e96f1](https://github.com/nozomiishii/configs/commit/b5e96f1cb4ad35725b44cf9b19cd01b02d798fa9))

### Miscellaneous

- **commitlint-config:** add vitest tests for commit-message-ascii-only ([#2148](https://github.com/nozomiishii/configs/issues/2148)) ([7f80831](https://github.com/nozomiishii/configs/commit/7f808312173fa771ee6e37a082afd7599a26cfc1))

## [0.1.0](https://github.com/nozomiishii/configs/compare/@nozomiishii/commitlint-config-v0.0.11...@nozomiishii/commitlint-config-v0.1.0) (2026-04-28)

### ⚠ BREAKING CHANGES

- bin field changes from a single setup script ("bin": "bin/cli.sh") to a namespaced map ({ "nozo-commitlint": "bin/cli.mjs" }). Consumers who previously ran pnpx @nozomiishii/commitlint-config@latest to scaffold a commitlint config now need a different mechanism (planned for nozo init in a follow-up PR).

### Features

- modularize lefthook config + commitlint shim + nozo CLI rebuild ([#2119](https://github.com/nozomiishii/configs/issues/2119)) ([1140b62](https://github.com/nozomiishii/configs/commit/1140b62e3d0430f2383a5f683ea2583fa4ea7ee9)), closes [#2118](https://github.com/nozomiishii/configs/issues/2118)

### Miscellaneous

- update dependency @commitlint/cli to v20.5.2 ([#2120](https://github.com/nozomiishii/configs/issues/2120)) ([f127eab](https://github.com/nozomiishii/configs/commit/f127eab67e0c2a76c7d4b11edcdb67b92e12baaf))

## [0.0.11](https://github.com/nozomiishii/configs/compare/@nozomiishii/commitlint-config-v0.0.10...@nozomiishii/commitlint-config-v0.0.11) (2026-04-27)

### Features

- **commitlint-config:** add body-ascii-only rule ([#2094](https://github.com/nozomiishii/configs/issues/2094)) ([cf870b9](https://github.com/nozomiishii/configs/commit/cf870b9cf722a01f6843ab4b536ac68ddd60010a))

### Miscellaneous

- **commitlint-config:** migrate to TypeScript source with tsdown build ([#2061](https://github.com/nozomiishii/configs/issues/2061)) ([b394ec0](https://github.com/nozomiishii/configs/commit/b394ec0b9e70624cc7311b72309e786315b9aed2))
- release main ([#2031](https://github.com/nozomiishii/configs/issues/2031)) ([ba1c8b0](https://github.com/nozomiishii/configs/commit/ba1c8b0d0373eb1cc65bc89702ba1a41f5923e6b))
- update dependency tsdown to v0.21.10 ([#2112](https://github.com/nozomiishii/configs/issues/2112)) ([21939bb](https://github.com/nozomiishii/configs/commit/21939bb55da1202f1e84eaed0f10a07c65c23e41))
- update dependency tsdown to v0.21.8 ([#2070](https://github.com/nozomiishii/configs/issues/2070)) ([bdcdeab](https://github.com/nozomiishii/configs/commit/bdcdeab2a83cfef17629d63b621b431a9399cd56))
- update dependency tsdown to v0.21.9 ([#2085](https://github.com/nozomiishii/configs/issues/2085)) ([eaeb311](https://github.com/nozomiishii/configs/commit/eaeb311df48848207f0a3ae5aa051eece4bfa278))
- update dependency typescript to v6.0.3 ([#2088](https://github.com/nozomiishii/configs/issues/2088)) ([25e9e34](https://github.com/nozomiishii/configs/commit/25e9e34004a9069de68430008b4daca34bcac000))
- update pnpm to v10.33.1 ([#2110](https://github.com/nozomiishii/configs/issues/2110)) ([5af1dc0](https://github.com/nozomiishii/configs/commit/5af1dc0b5d2ce5c49bc1f97a87d04f1e72aadd51))
- update pnpm to v10.33.2 ([#2114](https://github.com/nozomiishii/configs/issues/2114)) ([de64989](https://github.com/nozomiishii/configs/commit/de64989ce298d538e759f980ab505030be9a3e24))

## [0.0.10](https://github.com/nozomiishii/configs/compare/@nozomiishii/commitlint-config-v0.0.9...@nozomiishii/commitlint-config-v0.0.10) (2026-04-03)

### Features

- **commitlint-config:** restrict commit types to feat, fix, and chore ([#2027](https://github.com/nozomiishii/configs/issues/2027)) ([47ba00c](https://github.com/nozomiishii/configs/commit/47ba00c950861b2ca68e4e557f6264a3ad404e63))

## [0.0.9](https://github.com/nozomiishii/configs/compare/@nozomiishii/commitlint-config-v0.0.8...@nozomiishii/commitlint-config-v0.0.9) (2026-01-19)

### Bug Fixes

- update installation commands in README files to use pnpx instead of npx ([d8c68bc](https://github.com/nozomiishii/configs/commit/d8c68bce6370baa876e773e4b64a9b24fdfca36f))

## [0.0.8](https://github.com/nozomiishii/configs/compare/@nozomiishii/commitlint-config-v0.0.7...@nozomiishii/commitlint-config-v0.0.8) (2025-09-02)

### Bug Fixes

- remove node engine from package.json files ([b3ad146](https://github.com/nozomiishii/configs/commit/b3ad14646e733a4c7435544e76b8a7238f333388))

## [0.0.7](https://github.com/nozomiishii/configs/compare/@nozomiishii/commitlint-config-v0.0.6...@nozomiishii/commitlint-config-v0.0.7) (2025-08-21)

### Bug Fixes

- devEngines in package.json ([02d57a3](https://github.com/nozomiishii/configs/commit/02d57a31f4d4d403b14ad223661c9531faeda296))
- remove pnpm.executionEnv.nodeVersion ([9e2941a](https://github.com/nozomiishii/configs/commit/9e2941a0b00a83a5dc00391a533eccd3dd9b7824))

## [0.0.6](https://github.com/nozomiishii/configs/compare/@nozomiishii/commitlint-config-v0.0.5...@nozomiishii/commitlint-config-v0.0.6) (2025-05-03)

### Features

- add TypeScript configuration for Commitlint ([abee5aa](https://github.com/nozomiishii/configs/commit/abee5aa94794cbf84e46125c04dff02d71344316))

### Bug Fixes

- conditionally remove @commitlint/config-conventional before adding custom config ([dceaf95](https://github.com/nozomiishii/configs/commit/dceaf958b143ec9d2f445eda3fb38aeeded3c825))
- update release workflow condition and add package manager configuration to multiple packages ([958992c](https://github.com/nozomiishii/configs/commit/958992ccd8bdaf906a50bb769ec45459fab81210))

## [0.0.5](https://github.com/nozomiishii/configs/compare/@nozomiishii/commitlint-config-v0.0.4...@nozomiishii/commitlint-config-v0.0.5) (2024-06-16)

### Features

- update commitlint install command ([26e256d](https://github.com/nozomiishii/configs/commit/26e256d2f9f4cff2afffd9ab93d99a21c472482f))

### Bug Fixes

- update commitlint version ([89b4158](https://github.com/nozomiishii/configs/commit/89b4158f8fd29f6b7d06dad89a4aa96d337cdfae))

## [0.0.4](https://github.com/nozomiishii/configs/compare/@nozomiishii/commitlint-config-v0.0.3...@nozomiishii/commitlint-config-v0.0.4) (2024-02-18)

### Features

- create @nozomiishii/commitlint-config ([1751de2](https://github.com/nozomiishii/configs/commit/1751de2e367b935821d8645a535eeda562c5e1bc))
- create @nozomiishii/commitlint-config ([#451](https://github.com/nozomiishii/configs/issues/451)) ([5ae75ef](https://github.com/nozomiishii/configs/commit/5ae75ef942eb7b486b890cb027515ee4e2b8fe14))

### Bug Fixes

- add script to remove @commitlint/config-conventional ([4d30566](https://github.com/nozomiishii/configs/commit/4d30566bdc823097cff015066fc40bd91e1be2e3))

## [0.0.3](https://github.com/nozomiishii/configs/compare/@nozomiishii/commitlint-config-v0.0.2...@nozomiishii/commitlint-config-v0.0.3) (2024-02-18)

### Bug Fixes

- add script to remove @commitlint/config-conventional ([4d30566](https://github.com/nozomiishii/configs/commit/4d30566bdc823097cff015066fc40bd91e1be2e3))

## [0.0.2](https://github.com/nozomiishii/configs/compare/@nozomiishii/commitlint-config-v0.0.1...@nozomiishii/commitlint-config-v0.0.2) (2024-02-18)

### Features

- create @nozomiishii/commitlint-config ([1751de2](https://github.com/nozomiishii/configs/commit/1751de2e367b935821d8645a535eeda562c5e1bc))
- create @nozomiishii/commitlint-config ([#451](https://github.com/nozomiishii/configs/issues/451)) ([5ae75ef](https://github.com/nozomiishii/configs/commit/5ae75ef942eb7b486b890cb027515ee4e2b8fe14))
