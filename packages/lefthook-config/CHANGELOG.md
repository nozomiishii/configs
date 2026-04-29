# Changelog

## [0.4.1](https://github.com/nozomiishii/configs/compare/@nozomiishii/lefthook-config-v0.4.0...@nozomiishii/lefthook-config-v0.4.1) (2026-04-29)


### Features

* **lefthook-config:** ship nozo-git-harvest shim ([#2124](https://github.com/nozomiishii/configs/issues/2124)) ([256ae89](https://github.com/nozomiishii/configs/commit/256ae8918527fd7c86ca118be332a808b75f5095)), closes [#2118](https://github.com/nozomiishii/configs/issues/2118)

## [0.4.0](https://github.com/nozomiishii/configs/compare/@nozomiishii/lefthook-config-v0.3.7...@nozomiishii/lefthook-config-v0.4.0) (2026-04-28)

### ⚠ BREAKING CHANGES

- bin field changes from a single setup script ("bin": "bin/cli.sh") to a namespaced map ({ "nozo-commitlint": "bin/cli.mjs" }). Consumers who previously ran pnpx @nozomiishii/commitlint-config@latest to scaffold a commitlint config now need a different mechanism (planned for nozo init in a follow-up PR).

### Features

- modularize lefthook config + commitlint shim + nozo CLI rebuild ([#2119](https://github.com/nozomiishii/configs/issues/2119)) ([1140b62](https://github.com/nozomiishii/configs/commit/1140b62e3d0430f2383a5f683ea2583fa4ea7ee9)), closes [#2118](https://github.com/nozomiishii/configs/issues/2118)

## [0.3.7](https://github.com/nozomiishii/configs/compare/@nozomiishii/lefthook-config-v0.3.6...@nozomiishii/lefthook-config-v0.3.7) (2026-04-27)

### Miscellaneous

- **lefthook-config:** remove pre-push format-check job ([#2117](https://github.com/nozomiishii/configs/issues/2117)) ([3febb99](https://github.com/nozomiishii/configs/commit/3febb99a767923e071e592cc67a7a3af0e32fc9c))
- release main ([#2031](https://github.com/nozomiishii/configs/issues/2031)) ([ba1c8b0](https://github.com/nozomiishii/configs/commit/ba1c8b0d0373eb1cc65bc89702ba1a41f5923e6b))
- update dependency lefthook to v2.1.5 ([#2045](https://github.com/nozomiishii/configs/issues/2045)) ([36a86c7](https://github.com/nozomiishii/configs/commit/36a86c71ac524c87d5a223f1af2b13cd4a5b7d0f))
- update dependency lefthook to v2.1.6 ([#2083](https://github.com/nozomiishii/configs/issues/2083)) ([c98897a](https://github.com/nozomiishii/configs/commit/c98897aa4437c0e97e4c2bbeb75efb09b86e85c1))
- update pnpm to v10.33.1 ([#2110](https://github.com/nozomiishii/configs/issues/2110)) ([5af1dc0](https://github.com/nozomiishii/configs/commit/5af1dc0b5d2ce5c49bc1f97a87d04f1e72aadd51))
- update pnpm to v10.33.2 ([#2114](https://github.com/nozomiishii/configs/issues/2114)) ([de64989](https://github.com/nozomiishii/configs/commit/de64989ce298d538e759f980ab505030be9a3e24))

## [0.3.6](https://github.com/nozomiishii/configs/compare/@nozomiishii/lefthook-config-v0.3.5...@nozomiishii/lefthook-config-v0.3.6) (2026-04-01)

### Bug Fixes

- add pre-push format check and scope format CI to all PRs ([#2015](https://github.com/nozomiishii/configs/issues/2015)) ([9553977](https://github.com/nozomiishii/configs/commit/955397758214088e7808d81fab5056f132ca3337))
- **lefthook-config:** add --frozen-lockfile to post-merge pnpm install ([#1999](https://github.com/nozomiishii/configs/issues/1999)) ([ab9fc5e](https://github.com/nozomiishii/configs/commit/ab9fc5efc025e4bc6103a7e53308b4dad789fec1))

## [0.3.5](https://github.com/nozomiishii/configs/compare/@nozomiishii/lefthook-config-v0.3.4...@nozomiishii/lefthook-config-v0.3.5) (2026-03-26)

### Bug Fixes

- **lefthook-config:** resolve exit status 1 and improve squash merge detection ([#1987](https://github.com/nozomiishii/configs/issues/1987)) ([6ff2334](https://github.com/nozomiishii/configs/commit/6ff23340356e73d99beb4dbed84116ff86e46368))

## [0.3.4](https://github.com/nozomiishii/configs/compare/@nozomiishii/lefthook-config-v0.3.3...@nozomiishii/lefthook-config-v0.3.4) (2026-03-26)

### Bug Fixes

- **lefthook-config:** resolve exit status 1 in cleanup-merged script ([#1983](https://github.com/nozomiishii/configs/issues/1983)) ([08caae1](https://github.com/nozomiishii/configs/commit/08caae155b6b8dd29ce33b9b009d06f1a458334c))

## [0.3.3](https://github.com/nozomiishii/configs/compare/@nozomiishii/lefthook-config-v0.3.2...@nozomiishii/lefthook-config-v0.3.3) (2026-03-26)

### Bug Fixes

- **lefthook-config:** detect squash-merged branches in cleanup-merged script ([#1980](https://github.com/nozomiishii/configs/issues/1980)) ([308ddf8](https://github.com/nozomiishii/configs/commit/308ddf83aee855d4c247d929e2798cef9d4787e6))

## [0.3.2](https://github.com/nozomiishii/configs/compare/@nozomiishii/lefthook-config-v0.3.1...@nozomiishii/lefthook-config-v0.3.2) (2026-03-25)

### Features

- **lefthook-config:** extract cleanup-merged into external shell script ([#1978](https://github.com/nozomiishii/configs/issues/1978)) ([2707166](https://github.com/nozomiishii/configs/commit/2707166fc38f41a64522e2a592403065febdb022))

## [0.3.1](https://github.com/nozomiishii/configs/compare/@nozomiishii/lefthook-config-v0.3.0...@nozomiishii/lefthook-config-v0.3.1) (2026-01-19)

### Bug Fixes

- update installation commands in README files to use pnpx instead of npx ([d8c68bc](https://github.com/nozomiishii/configs/commit/d8c68bce6370baa876e773e4b64a9b24fdfca36f))

## [0.3.0](https://github.com/nozomiishii/configs/compare/@nozomiishii/lefthook-config-v0.2.8...@nozomiishii/lefthook-config-v0.3.0) (2025-12-10)

### ⚠ BREAKING CHANGES

- replace @evilmartians/lefthook with lefthook

### Features

- replace @evilmartians/lefthook with lefthook ([ecd44c9](https://github.com/nozomiishii/configs/commit/ecd44c98cefed5bd5b6d109145bded1389bc33d5))

## [0.2.8](https://github.com/nozomiishii/configs/compare/@nozomiishii/lefthook-config-v0.2.7...@nozomiishii/lefthook-config-v0.2.8) (2025-09-02)

### Bug Fixes

- remove node engine from package.json files ([b3ad146](https://github.com/nozomiishii/configs/commit/b3ad14646e733a4c7435544e76b8a7238f333388))

## [0.2.7](https://github.com/nozomiishii/configs/compare/@nozomiishii/lefthook-config-v0.2.6...@nozomiishii/lefthook-config-v0.2.7) (2025-08-21)

### Bug Fixes

- devEngines in package.json ([02d57a3](https://github.com/nozomiishii/configs/commit/02d57a31f4d4d403b14ad223661c9531faeda296))
- remove pnpm.executionEnv.nodeVersion ([9e2941a](https://github.com/nozomiishii/configs/commit/9e2941a0b00a83a5dc00391a533eccd3dd9b7824))

## [0.2.6](https://github.com/nozomiishii/configs/compare/@nozomiishii/lefthook-config-v0.2.5...@nozomiishii/lefthook-config-v0.2.6) (2025-07-22)

### Bug Fixes

- fail to release ([df126af](https://github.com/nozomiishii/configs/commit/df126af8c9653c75fe4dc34136d166ead03ed742))

## [0.2.5](https://github.com/nozomiishii/configs/compare/@nozomiishii/lefthook-config-v0.2.4...@nozomiishii/lefthook-config-v0.2.5) (2025-07-12)

### Features

- replace npx with pnpx for commitlint command ([ddcb0a7](https://github.com/nozomiishii/configs/commit/ddcb0a7236161ac66bf7392b49bdb13909135c69))

## [0.2.4](https://github.com/nozomiishii/configs/compare/@nozomiishii/lefthook-config-v0.2.3...@nozomiishii/lefthook-config-v0.2.4) (2025-06-02)

### Features

- add pre-commit script to check for 'link:' in package.json ([45b30f4](https://github.com/nozomiishii/configs/commit/45b30f45747c3cc7f77762972f0ba6b18c67a574))

## [0.2.3](https://github.com/nozomiishii/configs/compare/@nozomiishii/lefthook-config-v0.2.2...@nozomiishii/lefthook-config-v0.2.3) (2025-05-04)

### Bug Fixes

- streamline pnpm install command in post-merge hook ([df5b75c](https://github.com/nozomiishii/configs/commit/df5b75cb3ecebbac7e632160d69f38c5e8fb53a1))
- update release workflow condition and add package manager configuration to multiple packages ([958992c](https://github.com/nozomiishii/configs/commit/958992ccd8bdaf906a50bb769ec45459fab81210))

## [0.2.2](https://github.com/nozomiishii/configs/compare/@nozomiishii/lefthook-config-v0.2.1...@nozomiishii/lefthook-config-v0.2.2) (2024-06-16)

### Features

- add LEFTHOOK_VERBOSE true to update-node-modules ([8e05b51](https://github.com/nozomiishii/configs/commit/8e05b5192afacccf4ebc75ce979bde3355a77d97))

## [0.2.1](https://github.com/nozomiishii/configs/compare/@nozomiishii/lefthook-config-v0.2.0...@nozomiishii/lefthook-config-v0.2.1) (2024-02-18)

### Features

- create @nozomiishii/commitlint-config ([1751de2](https://github.com/nozomiishii/configs/commit/1751de2e367b935821d8645a535eeda562c5e1bc))
- create @nozomiishii/commitlint-config ([#451](https://github.com/nozomiishii/configs/issues/451)) ([5ae75ef](https://github.com/nozomiishii/configs/commit/5ae75ef942eb7b486b890cb027515ee4e2b8fe14))

## [0.2.0](https://github.com/nozomiishii/configs/compare/@nozomiishii/lefthook-config-v0.1.0...@nozomiishii/lefthook-config-v0.2.0) (2023-08-06)

### Features

- add initial CHANGELOG ([9ce8c62](https://github.com/nozomiishii/configs/commit/9ce8c62626daccb52d6855312820188fbb069a18))
