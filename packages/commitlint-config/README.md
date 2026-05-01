# @nozomiishii/commitlint-config

English | [日本語](./README.ja.md)

Nozomi's recommended [commitlint](https://commitlint.js.org) config.

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/487L0pNZKONFN01oHO/giphy.gif" alt="Coding" width="480" />
</div>
<div align="right">
  <small>via Locaweb on GIPHY</small>
</div>
<br>

## Install

```bash
pnpm add -D @nozomiishii/commitlint-config
```

## Usage

Add `commitlint.config.ts` (or `.js`) that extends this package:

```ts
import config from '@nozomiishii/commitlint-config';

export default config;
```

The package also ships a namespaced bin, `nozo-commitlint`, which wraps the
pinned `@commitlint/cli`. Lefthook configs (e.g. `@nozomiishii/lefthook-config`)
invoke the shim directly:

```yaml
commit-msg:
  jobs:
    - name: commitlint
      run: node_modules/.bin/nozo-commitlint --edit {1} --verbose
```
