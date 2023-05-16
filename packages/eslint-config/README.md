# @nozomiishii/eslint-config

Nozomi's Recommended [eslint](https://eslint.org/) Config.

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/FHEjBpiqMwSuA/giphy.gif" alt="Coding" width="480" />
</div>
<br>

## Gist

```bash
yarn add -D eslint typescript eslint-define-config @nozomiishii/eslint-config && touch .eslintrc.cjs
```

scriptの設定

```bash
pnpm pkg set scripts.eslint="eslint . --max-warnings=0 --ignore-path .gitignore" \
pnpm pkg set scripts.lint="yarn eslint" \
pnpm pkg set scripts.lint:fix="yarn eslint --fix"
```

package.json

```json
{
  "scripts": {
    "eslint": "eslint . --max-warnings=0 --ignore-path .gitignore",
    "lint": "yarn eslint",
    "lint:fix": "yarn eslint --fix",
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
    project: './tsconfig.json',
    sourceType: 'module',
  },

  extends: '@nozomiishii',
});

```

## Dependencies

```shell
@next/eslint-plugin-next \
@typescript-eslint/eslint-plugin \
@typescript-eslint/parser \
@vercel/style-guide \
eslint \
eslint-config-airbnb-base \
eslint-config-airbnb-typescript \
eslint-config-prettier \
eslint-define-config \
eslint-import-resolver-typescript \
eslint-plugin-eslint-comments \
eslint-plugin-import \
eslint-plugin-jsx-a11y \
eslint-plugin-playwright \
eslint-plugin-react \
eslint-plugin-react-hooks \
eslint-plugin-sort-keys-custom-order \
eslint-plugin-storybook \
eslint-plugin-tailwindcss \
eslint-plugin-testing-library \
eslint-plugin-tsdoc \
eslint-plugin-unicorn \
eslint-plugin-vitest
```

## 便利そうなカスタムルールたち

### 特定のimportを禁止

[no-restricted-imports](https://eslint.org/docs/latest/rules/no-restricted-imports)
[ESLintで特定のimportを禁止する](https://blog.mahoroi.com/posts/2019/03/eslint-no-restricted-import/)
