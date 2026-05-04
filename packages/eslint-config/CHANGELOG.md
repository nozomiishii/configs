# Changelog

## [0.8.0](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.7.0...@nozomiishii/eslint-config-v0.8.0) (2026-05-02)

### ⚠ BREAKING CHANGES

- **eslint-config:** consumers will see new lint errors on any existing eslint-disable comments in their code. To opt out per file, add a flat config override that turns the no-use rule off for the matching files glob.

### Features

- **eslint-config:** ban eslint-disable comments via no-use rule ([#2158](https://github.com/nozomiishii/configs/issues/2158)) ([429edd0](https://github.com/nozomiishii/configs/commit/429edd00f3267d27359f66782559f04b426b6f25))

### Miscellaneous

- update dependency @eslint-react/eslint-plugin to v5 ([#2153](https://github.com/nozomiishii/configs/issues/2153)) ([8511913](https://github.com/nozomiishii/configs/commit/85119134f7ee3a58a23d617bf9b06700ff862d64))
- update dependency eslint-plugin-storybook to v10.3.6 ([#2161](https://github.com/nozomiishii/configs/issues/2161)) ([daacc17](https://github.com/nozomiishii/configs/commit/daacc17508627b42489c987d745c38636ea2fdb7))

## [0.7.0](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.6.14...@nozomiishii/eslint-config-v0.7.0) (2026-05-01)

### ⚠ BREAKING CHANGES

- **prettier-config:** The printWidth default is changed from 119 to 100. Lines in the 100-119 range will be re-formatted in consumer codebases on the next format run.
- **prettier-config:** The singleQuote default is changed from true to false. Consumer repositories will see string literals re-formatted from single to double quotes.

### Features

- **eslint-config:** enforce .test.{ts,tsx} via vitest/consistent-test-filename ([#2130](https://github.com/nozomiishii/configs/issues/2130)) ([50cf240](https://github.com/nozomiishii/configs/commit/50cf24066671a4f80c2297aa44b198e60fdc0d08))
- **prettier-config:** change printWidth default from 119 to 100 ([#2141](https://github.com/nozomiishii/configs/issues/2141)) ([949e037](https://github.com/nozomiishii/configs/commit/949e037f45d4ccfd8647fceeea4338bd5b6f697e))
- **prettier-config:** revert singleQuote to Prettier default ([#2140](https://github.com/nozomiishii/configs/issues/2140)) ([c2f2ff5](https://github.com/nozomiishii/configs/commit/c2f2ff5ef8f68d53e7caf67206e95b8c16a10037))

### Bug Fixes

- add Japanese READMEs for shared config packages ([#2151](https://github.com/nozomiishii/configs/issues/2151)) ([b5e96f1](https://github.com/nozomiishii/configs/commit/b5e96f1cb4ad35725b44cf9b19cd01b02d798fa9))

### Miscellaneous

- update dependency eslint-plugin-better-tailwindcss to v4.5.0 ([#2138](https://github.com/nozomiishii/configs/issues/2138)) ([8674123](https://github.com/nozomiishii/configs/commit/8674123b1a2e0483d4aac17df42aeef531607797))
- update dependency eslint-plugin-package-json to v0.91.2 ([#2137](https://github.com/nozomiishii/configs/issues/2137)) ([e803a96](https://github.com/nozomiishii/configs/commit/e803a96cbffc55e912e6d122900da5daebc6a14c))
- update dependency typescript-eslint to v8.59.1 ([#2136](https://github.com/nozomiishii/configs/issues/2136)) ([0f6e369](https://github.com/nozomiishii/configs/commit/0f6e369a44062d8a9c11eb8962dce6b36b37bfd6))

## [0.6.14](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.6.13...@nozomiishii/eslint-config-v0.6.14) (2026-04-27)

### Miscellaneous

- **commitlint-config:** migrate to TypeScript source with tsdown build ([#2061](https://github.com/nozomiishii/configs/issues/2061)) ([b394ec0](https://github.com/nozomiishii/configs/commit/b394ec0b9e70624cc7311b72309e786315b9aed2))
- release main ([#2031](https://github.com/nozomiishii/configs/issues/2031)) ([ba1c8b0](https://github.com/nozomiishii/configs/commit/ba1c8b0d0373eb1cc65bc89702ba1a41f5923e6b))
- update dependency @eslint-react/eslint-plugin to v4 ([#2036](https://github.com/nozomiishii/configs/issues/2036)) ([32eec90](https://github.com/nozomiishii/configs/commit/32eec902357f32f5044fcc5576b61feb34131448))
- update dependency @eslint-react/eslint-plugin to v4.2.3 ([#2040](https://github.com/nozomiishii/configs/issues/2040)) ([f5405d8](https://github.com/nozomiishii/configs/commit/f5405d8ffac606b3ed5472829115c3b7517f6236))
- update dependency @eslint/config-inspector to v2 ([#2087](https://github.com/nozomiishii/configs/issues/2087)) ([f5c7235](https://github.com/nozomiishii/configs/commit/f5c723504addd4e9f89d4ce06aaa13762e581c01))
- update dependency @next/eslint-plugin-next to v16.2.2 ([#2034](https://github.com/nozomiishii/configs/issues/2034)) ([d83951d](https://github.com/nozomiishii/configs/commit/d83951d2668a6214f780f3d2d77fe46f84fa6257))
- update dependency @next/eslint-plugin-next to v16.2.3 ([#2051](https://github.com/nozomiishii/configs/issues/2051)) ([12471f8](https://github.com/nozomiishii/configs/commit/12471f8529d677ae9def323bd73ef5cf83ab3b8e))
- update dependency @next/eslint-plugin-next to v16.2.4 ([#2082](https://github.com/nozomiishii/configs/issues/2082)) ([6785bbd](https://github.com/nozomiishii/configs/commit/6785bbd3e354cd5826f49702f96c51fa72d652e8))
- update dependency @types/node to v24.12.1 ([#2041](https://github.com/nozomiishii/configs/issues/2041)) ([d6f9a6d](https://github.com/nozomiishii/configs/commit/d6f9a6da6419e963ca3f343fc3108def95eafe84))
- update dependency @types/node to v24.12.2 ([#2042](https://github.com/nozomiishii/configs/issues/2042)) ([12f3031](https://github.com/nozomiishii/configs/commit/12f3031d32a6adbac606dd999978cd18d6b37526))
- update dependency @vitest/eslint-plugin to v1.6.14 ([#2028](https://github.com/nozomiishii/configs/issues/2028)) ([6d33eb3](https://github.com/nozomiishii/configs/commit/6d33eb304af2d8861ede329c75dd5dada38021f7))
- update dependency @vitest/eslint-plugin to v1.6.15 ([#2052](https://github.com/nozomiishii/configs/issues/2052)) ([5805a30](https://github.com/nozomiishii/configs/commit/5805a30c2d32890d5006bb4a542cdeb93fb62238))
- update dependency @vitest/eslint-plugin to v1.6.16 ([#2081](https://github.com/nozomiishii/configs/issues/2081)) ([9febc7e](https://github.com/nozomiishii/configs/commit/9febc7e21ee566540df031b4b2e80b6293c9b7a4))
- update dependency eslint to v10.2.0 ([#2044](https://github.com/nozomiishii/configs/issues/2044)) ([435e5ac](https://github.com/nozomiishii/configs/commit/435e5acbaeaca91f50d05701088230cab0893cec))
- update dependency eslint to v10.2.1 ([#2091](https://github.com/nozomiishii/configs/issues/2091)) ([1e41337](https://github.com/nozomiishii/configs/commit/1e41337b3f84fdcd92f84ed53ca2a08e84608921))
- update dependency eslint-plugin-better-tailwindcss to v4.4.0 ([#2055](https://github.com/nozomiishii/configs/issues/2055)) ([c77b550](https://github.com/nozomiishii/configs/commit/c77b550e4029c99d53df338b7915e335bfff90d5))
- update dependency eslint-plugin-better-tailwindcss to v4.4.1 ([#2062](https://github.com/nozomiishii/configs/issues/2062)) ([baa5677](https://github.com/nozomiishii/configs/commit/baa56776bcf6d9568cc144a7f0128f1d928b43e3))
- update dependency eslint-plugin-jsdoc to v62.9.0 ([#2035](https://github.com/nozomiishii/configs/issues/2035)) ([5979dcb](https://github.com/nozomiishii/configs/commit/5979dcb5fd4b3ca20aa4fc1a95dcc112e7f9e004))
- update dependency eslint-plugin-perfectionist to v5.8.0 ([#2038](https://github.com/nozomiishii/configs/issues/2038)) ([55b492b](https://github.com/nozomiishii/configs/commit/55b492ba659ebf14cd0871a1678151c13ce64763))
- update dependency eslint-plugin-perfectionist to v5.9.0 ([#2092](https://github.com/nozomiishii/configs/issues/2092)) ([e976d9e](https://github.com/nozomiishii/configs/commit/e976d9e40a4e57121cadb9bb4d89ee8925ecf9af))
- update dependency eslint-plugin-playwright to v2.10.2 ([#2095](https://github.com/nozomiishii/configs/issues/2095)) ([109274e](https://github.com/nozomiishii/configs/commit/109274eafaf5e772951a883561b306a6110e1d99))
- update dependency eslint-plugin-react-hooks to v7.1.1 ([#2089](https://github.com/nozomiishii/configs/issues/2089)) ([f1838c3](https://github.com/nozomiishii/configs/commit/f1838c34fb81831ba684f55d57cf561ec3fccd33))
- update dependency eslint-plugin-storybook to v10.3.4 ([#2037](https://github.com/nozomiishii/configs/issues/2037)) ([d71eb48](https://github.com/nozomiishii/configs/commit/d71eb48ef011559cd591ad02c61cdd278f24e043))
- update dependency eslint-plugin-storybook to v10.3.5 ([#2047](https://github.com/nozomiishii/configs/issues/2047)) ([e9056c4](https://github.com/nozomiishii/configs/commit/e9056c4a7e583dcf8e83bc41b9d0743e23a27a94))
- update dependency globals to v17.5.0 ([#2059](https://github.com/nozomiishii/configs/issues/2059)) ([ab618b7](https://github.com/nozomiishii/configs/commit/ab618b7f4b1a677683a4e77010b8e9b3ff5b4e26))
- update dependency tailwindcss to v4.2.3 ([#2098](https://github.com/nozomiishii/configs/issues/2098)) ([f9b2f3d](https://github.com/nozomiishii/configs/commit/f9b2f3d830b522cd7784ab839d41fdbad667078e))
- update dependency tailwindcss to v4.2.4 ([#2104](https://github.com/nozomiishii/configs/issues/2104)) ([fb7952c](https://github.com/nozomiishii/configs/commit/fb7952c7cae39626cc9c961d850e325a0d5e39f9))
- update dependency typescript to v6.0.3 ([#2088](https://github.com/nozomiishii/configs/issues/2088)) ([25e9e34](https://github.com/nozomiishii/configs/commit/25e9e34004a9069de68430008b4daca34bcac000))
- update dependency typescript-eslint to v8.58.0 ([#2026](https://github.com/nozomiishii/configs/issues/2026)) ([d933826](https://github.com/nozomiishii/configs/commit/d9338261de05ed76a4a27ac7cc2912fa922074b9))
- update dependency typescript-eslint to v8.58.1 ([#2049](https://github.com/nozomiishii/configs/issues/2049)) ([993a2c2](https://github.com/nozomiishii/configs/commit/993a2c264bbb40b762151015aa64a6929ad6f8a6))
- update dependency typescript-eslint to v8.58.2 ([#2078](https://github.com/nozomiishii/configs/issues/2078)) ([12c2375](https://github.com/nozomiishii/configs/commit/12c23753e9013b71d96fe03e4010e057a1d56659))
- update dependency typescript-eslint to v8.59.0 ([#2097](https://github.com/nozomiishii/configs/issues/2097)) ([50f6d91](https://github.com/nozomiishii/configs/commit/50f6d9102bc543d2dfa7d87d2a602b860f07b93d))
- update pnpm to v10.33.1 ([#2110](https://github.com/nozomiishii/configs/issues/2110)) ([5af1dc0](https://github.com/nozomiishii/configs/commit/5af1dc0b5d2ce5c49bc1f97a87d04f1e72aadd51))
- update pnpm to v10.33.2 ([#2114](https://github.com/nozomiishii/configs/issues/2114)) ([de64989](https://github.com/nozomiishii/configs/commit/de64989ce298d538e759f980ab505030be9a3e24))

## [0.6.13](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.6.12...@nozomiishii/eslint-config-v0.6.13) (2026-04-01)

### Bug Fixes

- **eslint-config:** remove completed defineConfig migration task from TODO ([#2017](https://github.com/nozomiishii/configs/issues/2017)) ([dc26fa3](https://github.com/nozomiishii/configs/commit/dc26fa3dee74304e5a68a4c2dd9c85cd2a65450e))

## [0.6.12](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.6.11...@nozomiishii/eslint-config-v0.6.12) (2026-03-17)

### Bug Fixes

- switch from typescript-eslint to eslint/config in import-x configuration ([58f1f02](https://github.com/nozomiishii/configs/commit/58f1f02801f4e5aab331518f6b79f01de05f34bd))

## [0.6.11](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.6.10...@nozomiishii/eslint-config-v0.6.11) (2026-02-11)

### Bug Fixes

- simplify react ESLint configuration by directly using recommended settings ([2a24259](https://github.com/nozomiishii/configs/commit/2a242594c5448c1aa511dafa44b28cc4e5a30b4f))
- update eslint-plugin-better-tailwindcss to v4.1.1 ([#1826](https://github.com/nozomiishii/configs/issues/1826)) ([75d09a1](https://github.com/nozomiishii/configs/commit/75d09a1bba1bded64446b62b53d3500b834e1427))

## [0.6.10](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.6.9...@nozomiishii/eslint-config-v0.6.10) (2026-01-21)

### Bug Fixes

- perfectionist/sort-imports error on eslint ([#1781](https://github.com/nozomiishii/configs/issues/1781)) ([387631d](https://github.com/nozomiishii/configs/commit/387631d6f1f3946ff9f26f1723ab27dece3775ae))

## [0.6.9](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.6.8...@nozomiishii/eslint-config-v0.6.9) (2026-01-19)

### Bug Fixes

- update @eslint-community/eslint-plugin-eslint-comments to v4.6.0 ([ff9bcca](https://github.com/nozomiishii/configs/commit/ff9bcca540ed4942f21dedec64bbead25de0a43b))
- update installation commands in README files to use pnpx instead of npx ([d8c68bc](https://github.com/nozomiishii/configs/commit/d8c68bce6370baa876e773e4b64a9b24fdfca36f))
- update markdownlint and prettier configurations to improve formatting rules ([#1774](https://github.com/nozomiishii/configs/issues/1774)) ([de91846](https://github.com/nozomiishii/configs/commit/de91846585c60a28cba5f7a01e897201ea3d0ca3))
- update storybook ESLint plugin links to point to the new repository structure ([b04cb40](https://github.com/nozomiishii/configs/commit/b04cb4058d2b7c558fcdd9d691b7f35a546b9f82))

## [0.6.8](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.6.7...@nozomiishii/eslint-config-v0.6.8) (2025-12-11)

### Bug Fixes

- disable require-top-level-describe rule in viest config ([64da997](https://github.com/nozomiishii/configs/commit/64da99757c103d47888f3c59da509de1c628d453))
- prefer-expect-assertions rule in viest config ([e796a1a](https://github.com/nozomiishii/configs/commit/e796a1aba93353589ddd3dfd337b18a00b2bd00a))

## [0.6.7](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.6.6...@nozomiishii/eslint-config-v0.6.7) (2025-11-10)

### Bug Fixes

- remove reference to react-compiler in TODO.md in eslint-config ([193762c](https://github.com/nozomiishii/configs/commit/193762c0bfa1a0f6931cd113f86502c2db277b41))

## [0.6.6](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.6.5...@nozomiishii/eslint-config-v0.6.6) (2025-11-10)

### Bug Fixes

- pnpm-lock file version in eslint-config ([6ce6c9b](https://github.com/nozomiishii/configs/commit/6ce6c9bf35476b492a13ad93debed7768328bc2f))

## [0.6.5](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.6.4...@nozomiishii/eslint-config-v0.6.5) (2025-11-10)

### Features

- add @stylistic/eslint-plugin and integrate stylistic rules into eslint-config ([f9a7c4b](https://github.com/nozomiishii/configs/commit/f9a7c4be338240abfd08bdfb315d9a34c4165c7f))
- enable react-refresh rule in ESLint configuration ([c82e546](https://github.com/nozomiishii/configs/commit/c82e546ca1f0b5bdf17295fba7399a88c7fff636))

### Bug Fixes

- disable deprecated 'vitest/no-done-callback' rule ([43c7de1](https://github.com/nozomiishii/configs/commit/43c7de1572f8121f24a9c105f4a3397cde680e4f))
- eslint build error in nextjs rules ([971bced](https://github.com/nozomiishii/configs/commit/971bced409e11111c94b668f9150d920eb6f8110))
- import-x rules tseslint.config ([2bda4c5](https://github.com/nozomiishii/configs/commit/2bda4c586a8f3780612b9b4933ab5bceb9e70580))
- remove unused react-compiler rule from eslint configuration ([f74bf1f](https://github.com/nozomiishii/configs/commit/f74bf1fbadc158778a6daad9078244697e4a6ca0))
- update dependency eslint-plugin-react-hooks to v7 ([71d83d9](https://github.com/nozomiishii/configs/commit/71d83d995dcb7a526f53b5d722a96d064b461616))
- update renovate configuration and adjust Node.js engine version ([1eaa26e](https://github.com/nozomiishii/configs/commit/1eaa26ee3ad4e804c91b37411eeab709e9323eb5))
- use defineConfig instead of tseslint.config in typescript eslint rules ([8a5e316](https://github.com/nozomiishii/configs/commit/8a5e316c6b018f3b8d252a08d819c683fde7a1a6))

## [0.6.4](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.6.3...@nozomiishii/eslint-config-v0.6.4) (2025-09-02)

### Bug Fixes

- remove node engine from package.json files ([b3ad146](https://github.com/nozomiishii/configs/commit/b3ad14646e733a4c7435544e76b8a7238f333388))

## [0.6.3](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.6.2...@nozomiishii/eslint-config-v0.6.3) (2025-08-21)

### Bug Fixes

- devEngines in package.json ([02d57a3](https://github.com/nozomiishii/configs/commit/02d57a31f4d4d403b14ad223661c9531faeda296))
- remove pnpm.executionEnv.nodeVersion ([9e2941a](https://github.com/nozomiishii/configs/commit/9e2941a0b00a83a5dc00391a533eccd3dd9b7824))

## [0.6.2](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.6.1...@nozomiishii/eslint-config-v0.6.2) (2025-08-12)

### Bug Fixes

- eslint Next.js configuration ([#1342](https://github.com/nozomiishii/configs/issues/1342)) ([ba4a1d7](https://github.com/nozomiishii/configs/commit/ba4a1d764a90ed3933b3dbdef9e09831219b91e7))

## [0.6.1](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.6.0...@nozomiishii/eslint-config-v0.6.1) (2025-07-08)

### Bug Fixes

- turn off better-tailwindcss/enforce-consistent-line-wrapping ([e4894b0](https://github.com/nozomiishii/configs/commit/e4894b09fea3eb7c5eef7c47231996add25acebe))

## [0.6.0](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.5.3...@nozomiishii/eslint-config-v0.6.0) (2025-07-06)

### ⚠ BREAKING CHANGES

- replace eslint-plugin-tailwindcss with eslint-plugin-better-tailwindcss

### Features

- replace eslint-plugin-tailwindcss with eslint-plugin-better-tailwindcss ([916d5ba](https://github.com/nozomiishii/configs/commit/916d5bae22fb7ee1fcd290cc236469303ef28784))

### Bug Fixes

- support pnpm.executionEnv.nodeVersion ([974aabe](https://github.com/nozomiishii/configs/commit/974aabe6961683189e612236e48513cd4acf0cd0))

## [0.5.3](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.5.2...@nozomiishii/eslint-config-v0.5.3) (2025-07-01)

### Bug Fixes

- improve typescript eslint configuration ([465aeae](https://github.com/nozomiishii/configs/commit/465aeae461f81ca44ac79cc731de23c331eff2e7))

## [0.5.2](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.5.1...@nozomiishii/eslint-config-v0.5.2) (2025-07-01)

### Bug Fixes

- eslint-plugin-storybook error ([a3c901f](https://github.com/nozomiishii/configs/commit/a3c901f0458d92b5dfc15ad2945b763e699b8981))
- update eslint-plugin-vitest ([1a65fd5](https://github.com/nozomiishii/configs/commit/1a65fd56e86678b15cefa39bda66f2d4cbac77a7))

## [0.5.1](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.5.0...@nozomiishii/eslint-config-v0.5.1) (2025-06-02)

### Bug Fixes

- typegen ([f28d097](https://github.com/nozomiishii/configs/commit/f28d097816bca578472efa19dcf4d13d0e999640))
- update install command for Flat Config support ([cf24046](https://github.com/nozomiishii/configs/commit/cf240463990c674fbabd71c0c9a31bf15225924d))

## [0.5.0](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.4.8...@nozomiishii/eslint-config-v0.5.0) (2025-06-02)

### ⚠ BREAKING CHANGES

- migrete to flat config

### Features

- migrete to flat config ([c5ff410](https://github.com/nozomiishii/configs/commit/c5ff4107999b678374aade48327d45fb509a4d15))

### Bug Fixes

- replace eslint-plugin-eslint-comments to @eslint-community/eslint-plugin-eslint-comments ([46dccbb](https://github.com/nozomiishii/configs/commit/46dccbbc49088118f2d0776b61676aa04b7cd42d))
- update release workflow condition and add package manager configuration to multiple packages ([958992c](https://github.com/nozomiishii/configs/commit/958992ccd8bdaf906a50bb769ec45459fab81210))

## [0.4.8](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.4.7...@nozomiishii/eslint-config-v0.4.8) (2025-01-02)

### Features

- add playwright/max-expects ([13d269b](https://github.com/nozomiishii/configs/commit/13d269be4a0b2ffa62df22244625fb33dcc87dff))
- add playwright/max-nested-describe ([f7f91c6](https://github.com/nozomiishii/configs/commit/f7f91c6dc0464da210bc9968c6d602d60e7a6197))
- increase max-nested-describe limit to 2 in eslint playwright ([d30da99](https://github.com/nozomiishii/configs/commit/d30da996b099d85ffcbf519a39db55631e6b6e20))

### Bug Fixes

- add expiring-todo-comments rule and adjust consistent-function-scoping for test files ([5c5cdfc](https://github.com/nozomiishii/configs/commit/5c5cdfc8a521ced130ec74f81ab5d3bab82f1877))
- ignore .playwright and .storybook from vitest lint ([fe0adb8](https://github.com/nozomiishii/configs/commit/fe0adb8f207b01650e2023f2f18003c5609de31e))
- turn off require-top-level-describe ([8ba2d54](https://github.com/nozomiishii/configs/commit/8ba2d54eb3bfc1b5b69ad1c863c89f1ced0cca28))
- update internal-pattern regex for module resolution ([a746239](https://github.com/nozomiishii/configs/commit/a746239fe3e0c11b58c5c7802bfd095f5ad44f66))

## [0.4.7](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.4.6...@nozomiishii/eslint-config-v0.4.7) (2024-08-04)

### Features

- update eslint-config for playwright rules ([eacbbdc](https://github.com/nozomiishii/configs/commit/eacbbdc888e222f8752b935073bee15030feb7db))

### Bug Fixes

- add description to perfectionist/sort-imports ([092d6db](https://github.com/nozomiishii/configs/commit/092d6db962fbc6e161b9f66fb3ab63b922dc8254))
- turn off jsdoc/require-jsdoc rules in test files ([432af76](https://github.com/nozomiishii/configs/commit/432af767db8336a32d217d29f9d8586195ff2999))

## [0.4.6](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.4.5...@nozomiishii/eslint-config-v0.4.6) (2024-06-16)

### Features

- add @typescript-eslint/method-signature-style ([63cdd79](https://github.com/nozomiishii/configs/commit/63cdd79b721c415bc69219e13c31a789245bb164))
- add eslint-plugin-jsx-no-leaked-render rule ([ae1c1a9](https://github.com/nozomiishii/configs/commit/ae1c1a93e72e0bad1ad2c68eb788f23343b981e6))

### Bug Fixes

- update peerDependencies version ([bd65911](https://github.com/nozomiishii/configs/commit/bd65911bcd93b907565f00ac9aace0a60e560a5e))
- update storybook configuration for @storybook/test usage ([7c1ed0f](https://github.com/nozomiishii/configs/commit/7c1ed0f155c4ee3e618581b1685bf1a3b40d2873))

## [0.4.5](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.4.4...@nozomiishii/eslint-config-v0.4.5) (2024-02-18)

### Features

- add eslint rule for @tanstack/eslint-plugin-query ([b527faf](https://github.com/nozomiishii/configs/commit/b527faf7b640edc268a987f60739cff7bab75cc2))
- add initial CHANGELOG ([9ce8c62](https://github.com/nozomiishii/configs/commit/9ce8c62626daccb52d6855312820188fbb069a18))
- add jsdoc rules to eslint ([992efc5](https://github.com/nozomiishii/configs/commit/992efc59a2cf6246fcb68159e044fc7168d446bb))
- add padding-line-between-statements for switch, throw, and while ([1338f0f](https://github.com/nozomiishii/configs/commit/1338f0f25a763e6d9b37f6a97af6846c5ce564e8))
- apply eslint-plugin-perfectionist instead of eslint-plugin-sort to sorting rules ([beabc83](https://github.com/nozomiishii/configs/commit/beabc83ead3749270477d036f874f7507459e191))
- **eslint:** restrict the usage of global variables from @types/jest ([ac7fa84](https://github.com/nozomiishii/configs/commit/ac7fa84623ff0ed7dad21524ef4ab0777e82d767))
- **prettier:** update prettier version to v3 ([3ca3f49](https://github.com/nozomiishii/configs/commit/3ca3f49e8418f0507084983740bab3596a9f6460))
- **prettier:** update prettier version to v3 ([26239c9](https://github.com/nozomiishii/configs/commit/26239c9361d60734a5a13f635c4161de80bffbaa))

### Bug Fixes

- add line break rule for "for" statement ([44d705f](https://github.com/nozomiishii/configs/commit/44d705f736646b59ce2ea0445e39b29a9582800d))
- add line break rules ([d6aaab5](https://github.com/nozomiishii/configs/commit/d6aaab5256481eb6e2928375ba672c187f678bea))
- add testing library rules for react hooks ([8cb8203](https://github.com/nozomiishii/configs/commit/8cb8203e9cbc0a2eb1f2cf6b5e124acba82e578e))
- **deps:** update dependency @next/eslint-plugin-next to v13.4.10 ([#116](https://github.com/nozomiishii/configs/issues/116)) ([9b0a9a1](https://github.com/nozomiishii/configs/commit/9b0a9a1b011836e9ea649d0e558a14f495d0e5a6))
- **deps:** update dependency @next/eslint-plugin-next to v13.4.11 ([#126](https://github.com/nozomiishii/configs/issues/126)) ([d600ded](https://github.com/nozomiishii/configs/commit/d600ded73ede27d1a992a1930e3b4d6f41d65da3))
- **deps:** update dependency @next/eslint-plugin-next to v13.4.12 ([#127](https://github.com/nozomiishii/configs/issues/127)) ([18e3e12](https://github.com/nozomiishii/configs/commit/18e3e125c16d0402114917cdd155f6e84053208a))
- **deps:** update dependency @next/eslint-plugin-next to v13.4.9 ([#104](https://github.com/nozomiishii/configs/issues/104)) ([94037f0](https://github.com/nozomiishii/configs/commit/94037f0c5ceb329ec5b5873b873ea69f634d6f5e))
- **deps:** update dependency eslint to v8.44.0 ([#96](https://github.com/nozomiishii/configs/issues/96)) ([93351d8](https://github.com/nozomiishii/configs/commit/93351d82827143e0cf0a1aa50e9591c9c1b07b16))
- **deps:** update dependency eslint to v8.45.0 ([#117](https://github.com/nozomiishii/configs/issues/117)) ([a54f123](https://github.com/nozomiishii/configs/commit/a54f1237d89988b5897b8cbce94464a5bed52111))
- **deps:** update dependency eslint to v8.46.0 ([#138](https://github.com/nozomiishii/configs/issues/138)) ([6c7562c](https://github.com/nozomiishii/configs/commit/6c7562ca0d73fa09e1c78e822d8e96f613e8e667))
- **deps:** update dependency eslint-config-airbnb-typescript to v17.1.0 ([#114](https://github.com/nozomiishii/configs/issues/114)) ([584268b](https://github.com/nozomiishii/configs/commit/584268bc3b04d6bd605ed68fd920b48d97dd8da9))
- **deps:** update dependency eslint-config-prettier to v8.9.0 ([#136](https://github.com/nozomiishii/configs/issues/136)) ([4b734bf](https://github.com/nozomiishii/configs/commit/4b734bf1ebc8d43baa0173348d27c2b07eddc850))
- **deps:** update dependency eslint-define-config to v1.22.0 ([#140](https://github.com/nozomiishii/configs/issues/140)) ([d1bf499](https://github.com/nozomiishii/configs/commit/d1bf499c42439500750b644b969ffd48e8d45ffb))
- **deps:** update dependency eslint-plugin-import to v2.28.0 ([#137](https://github.com/nozomiishii/configs/issues/137)) ([7aa46be](https://github.com/nozomiishii/configs/commit/7aa46be7e20fd331adedcb1294f4e00eaa7f64ec))
- **deps:** update dependency eslint-plugin-playwright to v0.15.3 ([#100](https://github.com/nozomiishii/configs/issues/100)) ([65cb772](https://github.com/nozomiishii/configs/commit/65cb772617b906bd8572b029a76b6181705f9032))
- **deps:** update dependency eslint-plugin-react to v7.33.0 ([#125](https://github.com/nozomiishii/configs/issues/125)) ([2a005cf](https://github.com/nozomiishii/configs/commit/2a005cfee8d35aefdbd33634a7fbe75127a3fb70))
- **deps:** update dependency eslint-plugin-react to v7.33.1 ([#139](https://github.com/nozomiishii/configs/issues/139)) ([9659aed](https://github.com/nozomiishii/configs/commit/9659aed88fadb4e8934d67697c99eca3aee0ac35))
- **deps:** update dependency eslint-plugin-storybook to v0.6.13 ([#124](https://github.com/nozomiishii/configs/issues/124)) ([7e9d311](https://github.com/nozomiishii/configs/commit/7e9d31199d08bf7df1d12c206134c61b42c1112b))
- **deps:** update dependency eslint-plugin-unicorn to v48 ([#118](https://github.com/nozomiishii/configs/issues/118)) ([44db7de](https://github.com/nozomiishii/configs/commit/44db7de74d87fcf1811ed8a69b73d7f04c1f0261))
- **deps:** update dependency eslint-plugin-unicorn to v48.0.1 ([#134](https://github.com/nozomiishii/configs/issues/134)) ([1613680](https://github.com/nozomiishii/configs/commit/161368030e06bb483e40bcf2316e24748368ccb3))
- **deps:** update dependency eslint-plugin-vitest to v0.2.8 ([#135](https://github.com/nozomiishii/configs/issues/135)) ([68ff75c](https://github.com/nozomiishii/configs/commit/68ff75cc19403f4160f2a69b70e1664a09fa55b5))
- **deps:** update eslint ([#98](https://github.com/nozomiishii/configs/issues/98)) ([865aee5](https://github.com/nozomiishii/configs/commit/865aee5cf7b0636f00a01aba621cbf5a09febefa))
- **deps:** update eslint to v5.62.0 ([#109](https://github.com/nozomiishii/configs/issues/109)) ([25a6bfc](https://github.com/nozomiishii/configs/commit/25a6bfc52c97180b5af77bec61473910def8def7))
- **deps:** update eslint to v6.2.0 ([#132](https://github.com/nozomiishii/configs/issues/132)) ([4199bde](https://github.com/nozomiishii/configs/commit/4199bde472aba2ed3fcb6a4f130cbffe4c519788))
- **deps:** update eslint to v6.2.1 ([#143](https://github.com/nozomiishii/configs/issues/143)) ([2c4606f](https://github.com/nozomiishii/configs/commit/2c4606f0dd9b0db2617f8cfc3862c53ea9254b93))
- downgrade eslint-plugin-tailwindcss to 3.13.1 ([87e3599](https://github.com/nozomiishii/configs/commit/87e3599c55fefde76bfff9ed9f2f6e07929c4289))
- import/no-extraneous-dependencies in storybook ([4377b92](https://github.com/nozomiishii/configs/commit/4377b92167d97a96071018aab9a54c60193c9b7f))
- remove testing-library from eslint default config ([7ed25fa](https://github.com/nozomiishii/configs/commit/7ed25fa5b12234e1d7464086f69653523a1bfff0))
- remove unused eslint plugins and update README.md ([bb1161f](https://github.com/nozomiishii/configs/commit/bb1161f1611946e17f1ce2f0813621cc6f581ce6))
- set "unicorn/no-null: off" in eslint unicorn ([745398b](https://github.com/nozomiishii/configs/commit/745398bff74182f3671852c68fdfe4e8421aece9))
- support @storybook/test ([445d307](https://github.com/nozomiishii/configs/commit/445d3078497d64e836810b912f5e7bd2741e5806))
- typo in playwright eslint rule description ([55eb4f1](https://github.com/nozomiishii/configs/commit/55eb4f1a4c552b8ee1ac76c36e1545fe740da273))
- vitest/prefer-expect-assertions setup ([0f71382](https://github.com/nozomiishii/configs/commit/0f71382cd8db963240ccf86197a942be0a85899a))

## [0.4.4](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.4.3...@nozomiishii/eslint-config-v0.4.4) (2024-02-18)

### Bug Fixes

- downgrade eslint-plugin-tailwindcss to 3.13.1 ([87e3599](https://github.com/nozomiishii/configs/commit/87e3599c55fefde76bfff9ed9f2f6e07929c4289))

## [0.4.3](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.4.2...@nozomiishii/eslint-config-v0.4.3) (2024-02-18)

### Features

- add eslint rule for @tanstack/eslint-plugin-query ([b527faf](https://github.com/nozomiishii/configs/commit/b527faf7b640edc268a987f60739cff7bab75cc2))
- add jsdoc rules to eslint ([992efc5](https://github.com/nozomiishii/configs/commit/992efc59a2cf6246fcb68159e044fc7168d446bb))
- add padding-line-between-statements for switch, throw, and while ([1338f0f](https://github.com/nozomiishii/configs/commit/1338f0f25a763e6d9b37f6a97af6846c5ce564e8))
- apply eslint-plugin-perfectionist instead of eslint-plugin-sort to sorting rules ([beabc83](https://github.com/nozomiishii/configs/commit/beabc83ead3749270477d036f874f7507459e191))

### Bug Fixes

- add line break rule for "for" statement ([44d705f](https://github.com/nozomiishii/configs/commit/44d705f736646b59ce2ea0445e39b29a9582800d))
- add line break rules ([d6aaab5](https://github.com/nozomiishii/configs/commit/d6aaab5256481eb6e2928375ba672c187f678bea))
- add testing library rules for react hooks ([8cb8203](https://github.com/nozomiishii/configs/commit/8cb8203e9cbc0a2eb1f2cf6b5e124acba82e578e))
- remove testing-library from eslint default config ([7ed25fa](https://github.com/nozomiishii/configs/commit/7ed25fa5b12234e1d7464086f69653523a1bfff0))
- remove unused eslint plugins and update README.md ([bb1161f](https://github.com/nozomiishii/configs/commit/bb1161f1611946e17f1ce2f0813621cc6f581ce6))
- vitest/prefer-expect-assertions setup ([0f71382](https://github.com/nozomiishii/configs/commit/0f71382cd8db963240ccf86197a942be0a85899a))

## [0.4.2](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.4.1...@nozomiishii/eslint-config-v0.4.2) (2023-12-05)

### Bug Fixes

- import/no-extraneous-dependencies in storybook ([4377b92](https://github.com/nozomiishii/configs/commit/4377b92167d97a96071018aab9a54c60193c9b7f))

## [0.4.1](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.4.0...@nozomiishii/eslint-config-v0.4.1) (2023-12-05)

### Bug Fixes

- set "unicorn/no-null: off" in eslint unicorn ([745398b](https://github.com/nozomiishii/configs/commit/745398bff74182f3671852c68fdfe4e8421aece9))
- support @storybook/test ([445d307](https://github.com/nozomiishii/configs/commit/445d3078497d64e836810b912f5e7bd2741e5806))
- typo in playwright eslint rule description ([55eb4f1](https://github.com/nozomiishii/configs/commit/55eb4f1a4c552b8ee1ac76c36e1545fe740da273))

## [0.4.0](https://github.com/nozomiishii/configs/compare/@nozomiishii/eslint-config-v0.3.0...@nozomiishii/eslint-config-v0.4.0) (2023-08-06)

### Features

- add initial CHANGELOG ([9ce8c62](https://github.com/nozomiishii/configs/commit/9ce8c62626daccb52d6855312820188fbb069a18))
