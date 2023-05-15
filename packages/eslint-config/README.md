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

### Legacy config

```shell
@next/eslint-plugin-next \
@typescript-eslint/eslint-plugin \
@typescript-eslint/parser \
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

### flat config

```shell
@next/eslint-plugin-next \
@typescript-eslint/eslint-plugin \
@typescript-eslint/parser \
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
eslint-plugin-vitest \
globals \
parse-gitignore
```
