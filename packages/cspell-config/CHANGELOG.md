# Changelog

## [0.5.0](https://github.com/nozomiishii/configs/compare/@nozomiishii/cspell-config-v0.4.6...@nozomiishii/cspell-config-v0.5.0) (2026-05-01)

### ⚠ BREAKING CHANGES

- **prettier-config:** The printWidth default is changed from 119 to 100. Lines in the 100-119 range will be re-formatted in consumer codebases on the next format run.
- **prettier-config:** The singleQuote default is changed from true to false. Consumer repositories will see string literals re-formatted from single to double quotes.

### Features

- **cspell-config:** ship nozo-cspell shim ([#2129](https://github.com/nozomiishii/configs/issues/2129)) ([9ad7963](https://github.com/nozomiishii/configs/commit/9ad7963693e62c8ac70fb4d6618c657ceb424158)), closes [#2118](https://github.com/nozomiishii/configs/issues/2118)
- **prettier-config:** change printWidth default from 119 to 100 ([#2141](https://github.com/nozomiishii/configs/issues/2141)) ([949e037](https://github.com/nozomiishii/configs/commit/949e037f45d4ccfd8647fceeea4338bd5b6f697e))
- **prettier-config:** revert singleQuote to Prettier default ([#2140](https://github.com/nozomiishii/configs/issues/2140)) ([c2f2ff5](https://github.com/nozomiishii/configs/commit/c2f2ff5ef8f68d53e7caf67206e95b8c16a10037))

### Bug Fixes

- add Japanese READMEs for shared config packages ([#2151](https://github.com/nozomiishii/configs/issues/2151)) ([b5e96f1](https://github.com/nozomiishii/configs/commit/b5e96f1cb4ad35725b44cf9b19cd01b02d798fa9))

## [0.4.6](https://github.com/nozomiishii/configs/compare/@nozomiishii/cspell-config-v0.4.5...@nozomiishii/cspell-config-v0.4.6) (2026-04-27)

### Bug Fixes

- align tsdown to 0.21.8 in cspell-config and markdownlint-cli2-config ([#2076](https://github.com/nozomiishii/configs/issues/2076)) ([33b0a2e](https://github.com/nozomiishii/configs/commit/33b0a2e3e720fb4f07ec86fd94d34a5eb1579af9))

### Miscellaneous

- add provenance to publishConfig for all packages ([#1973](https://github.com/nozomiishii/configs/issues/1973)) ([165ef9b](https://github.com/nozomiishii/configs/commit/165ef9b1232b74a1e62222cf0683c2be413e8252))
- **cspell-config:** migrate to TypeScript source with tsdown build ([#2067](https://github.com/nozomiishii/configs/issues/2067)) ([cac2488](https://github.com/nozomiishii/configs/commit/cac2488318b1f844c2c3085aa6c71d71979407c2))
- release main ([#2031](https://github.com/nozomiishii/configs/issues/2031)) ([ba1c8b0](https://github.com/nozomiishii/configs/commit/ba1c8b0d0373eb1cc65bc89702ba1a41f5923e6b))
- update dependency tsdown to v0.21.10 ([#2112](https://github.com/nozomiishii/configs/issues/2112)) ([21939bb](https://github.com/nozomiishii/configs/commit/21939bb55da1202f1e84eaed0f10a07c65c23e41))
- update dependency tsdown to v0.21.9 ([#2085](https://github.com/nozomiishii/configs/issues/2085)) ([eaeb311](https://github.com/nozomiishii/configs/commit/eaeb311df48848207f0a3ae5aa051eece4bfa278))
- update dependency typescript to v6.0.3 ([#2088](https://github.com/nozomiishii/configs/issues/2088)) ([25e9e34](https://github.com/nozomiishii/configs/commit/25e9e34004a9069de68430008b4daca34bcac000))
- update pnpm to v10.28.1 ([#1783](https://github.com/nozomiishii/configs/issues/1783)) ([8ab851f](https://github.com/nozomiishii/configs/commit/8ab851f5b517d1a6aaf5f1a551712a9d08291fc8))
- update pnpm to v10.28.2 [security] ([#1803](https://github.com/nozomiishii/configs/issues/1803)) ([3bf99c7](https://github.com/nozomiishii/configs/commit/3bf99c70bf15d71c797480c5fc213c83b42cd9a3))
- update pnpm to v10.29.1 ([#1847](https://github.com/nozomiishii/configs/issues/1847)) ([331b504](https://github.com/nozomiishii/configs/commit/331b5045e0f62b613394d1a8bdd0da18c711399f))
- update pnpm to v10.29.2 ([#1849](https://github.com/nozomiishii/configs/issues/1849)) ([180c37e](https://github.com/nozomiishii/configs/commit/180c37e71c139f6dabe0dc62a7e227095c263fb6))
- update pnpm to v10.29.3 ([#1859](https://github.com/nozomiishii/configs/issues/1859)) ([a32b59f](https://github.com/nozomiishii/configs/commit/a32b59f56b170dd7f0dbf16718ed4806261e3910))
- update pnpm to v10.30.0 ([#1872](https://github.com/nozomiishii/configs/issues/1872)) ([a03fd07](https://github.com/nozomiishii/configs/commit/a03fd07e69295164b6fa576b06e724848c3c0559))
- update pnpm to v10.30.1 ([#1883](https://github.com/nozomiishii/configs/issues/1883)) ([233091d](https://github.com/nozomiishii/configs/commit/233091d278ab9b0271db6577aba1f13f29030fa6))
- update pnpm to v10.30.2 ([#1901](https://github.com/nozomiishii/configs/issues/1901)) ([9b75ad0](https://github.com/nozomiishii/configs/commit/9b75ad06e6ea552d983313bf44fbac83c6ccca11))
- update pnpm to v10.30.3 ([#1911](https://github.com/nozomiishii/configs/issues/1911)) ([bf0767e](https://github.com/nozomiishii/configs/commit/bf0767e66848eb142b058d11a5c8f2630e8809c8))
- update pnpm to v10.31.0 ([#1936](https://github.com/nozomiishii/configs/issues/1936)) ([a70a929](https://github.com/nozomiishii/configs/commit/a70a929d39a07c6ad9df8a9ad70d1bf49f198310))
- update pnpm to v10.32.0 ([#1943](https://github.com/nozomiishii/configs/issues/1943)) ([b2c305a](https://github.com/nozomiishii/configs/commit/b2c305a55fa6b3c48eb5bbb5011a22ed52cde7e0))
- update pnpm to v10.32.1 ([#1945](https://github.com/nozomiishii/configs/issues/1945)) ([e263599](https://github.com/nozomiishii/configs/commit/e2635991025302bcc85dd1c61016365c392dfd79))
- update pnpm to v10.33.0 ([#1995](https://github.com/nozomiishii/configs/issues/1995)) ([276cdda](https://github.com/nozomiishii/configs/commit/276cdda99f94f64e79eb87192e1e6d1b175c46b6))
- update pnpm to v10.33.1 ([#2110](https://github.com/nozomiishii/configs/issues/2110)) ([5af1dc0](https://github.com/nozomiishii/configs/commit/5af1dc0b5d2ce5c49bc1f97a87d04f1e72aadd51))
- update pnpm to v10.33.2 ([#2114](https://github.com/nozomiishii/configs/issues/2114)) ([de64989](https://github.com/nozomiishii/configs/commit/de64989ce298d538e759f980ab505030be9a3e24))

## [0.4.5](https://github.com/nozomiishii/configs/compare/@nozomiishii/cspell-config-v0.4.4...@nozomiishii/cspell-config-v0.4.5) (2026-01-19)

### Bug Fixes

- update installation commands in README files to use pnpx instead of npx ([d8c68bc](https://github.com/nozomiishii/configs/commit/d8c68bce6370baa876e773e4b64a9b24fdfca36f))

## [0.4.4](https://github.com/nozomiishii/configs/compare/@nozomiishii/cspell-config-v0.4.3...@nozomiishii/cspell-config-v0.4.4) (2025-09-02)

### Bug Fixes

- remove node engine from package.json files ([b3ad146](https://github.com/nozomiishii/configs/commit/b3ad14646e733a4c7435544e76b8a7238f333388))

## [0.4.3](https://github.com/nozomiishii/configs/compare/@nozomiishii/cspell-config-v0.4.2...@nozomiishii/cspell-config-v0.4.3) (2025-08-21)

### Bug Fixes

- devEngines in package.json ([02d57a3](https://github.com/nozomiishii/configs/commit/02d57a31f4d4d403b14ad223661c9531faeda296))
- remove pnpm.executionEnv.nodeVersion ([9e2941a](https://github.com/nozomiishii/configs/commit/9e2941a0b00a83a5dc00391a533eccd3dd9b7824))

## [0.4.2](https://github.com/nozomiishii/configs/compare/@nozomiishii/cspell-config-v0.4.1...@nozomiishii/cspell-config-v0.4.2) (2025-05-04)

### Bug Fixes

- update release workflow condition and add package manager configuration to multiple packages ([958992c](https://github.com/nozomiishii/configs/commit/958992ccd8bdaf906a50bb769ec45459fab81210))

## [0.4.1](https://github.com/nozomiishii/configs/compare/@nozomiishii/cspell-config-v0.4.0...@nozomiishii/cspell-config-v0.4.1) (2023-12-15)

### Bug Fixes

- cli execution of cspell ([f339442](https://github.com/nozomiishii/configs/commit/f339442e582517185d6a2f686bac29ff0b087f76))

## [0.4.0](https://github.com/nozomiishii/configs/compare/@nozomiishii/cspell-config-v0.3.0...@nozomiishii/cspell-config-v0.4.0) (2023-12-15)

### Features

- change runtime from node to bash ([43fb4b3](https://github.com/nozomiishii/configs/commit/43fb4b39ee6748e44f10b2273b436fa6aa92c937))

## [0.3.0](https://github.com/nozomiishii/configs/compare/@nozomiishii/cspell-config-v0.2.0...@nozomiishii/cspell-config-v0.3.0) (2023-08-06)

### Features

- add initial CHANGELOG ([9ce8c62](https://github.com/nozomiishii/configs/commit/9ce8c62626daccb52d6855312820188fbb069a18))
