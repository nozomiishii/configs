# @nozomiishii/eslint-config

Nozomi's Recommended [eslint](https://eslint.org/) Config.

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/FHEjBpiqMwSuA/giphy.gif" alt="Coding" width="480" />
</div>
<div align="right">
  <small>via GIPHY</small>
</div>
<br>

## Gist

```bash
npx -y @nozomiishii/eslint-config@latest
```

## Manual

```bash
pnpm add -D eslint typescript eslint-define-config @nozomiishii/eslint-config && touch .eslintrc.cjs
```

scriptの設定

```bash
pnpm pkg set scripts.eslint="eslint . --max-warnings=0 --ignore-path .gitignore" \
pnpm pkg set scripts.lint="pnpm eslint" \
pnpm pkg set scripts.lint:fix="pnpm eslint --fix"
```

package.json

```json
{
  "scripts": {
    "eslint": "eslint . --max-warnings=0 --ignore-path .gitignore",
    "lint": "pnpm eslint",
    "lint:fix": "pnpm eslint --fix"
  }
}
```

.eslintrc.cjs

```js
// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,

  ignorePatterns: ['.eslintrc.cjs', '*.config.*'],

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    tsconfigRootDir: __dirname,
    project: true,
    sourceType: 'module',
  },

  extends: '@nozomiishii',
});
```

## その他便利そうなカスタムルールたち（プロジェクトによって入れたい）

### 特定のimportを禁止

[no-restricted-imports](https://eslint.org/docs/latest/rules/no-restricted-imports)
[ESLintで特定のimportを禁止する](https://blog.mahoroi.com/posts/2019/03/eslint-no-restricted-import/)
