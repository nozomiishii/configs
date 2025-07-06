# Changelog

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
