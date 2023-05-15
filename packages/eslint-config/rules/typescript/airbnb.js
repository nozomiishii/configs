// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  extends: [
    /**
     * eslint-config-airbnb-typescript
     * {@link https://www.npmjs.com/package/eslint-config-airbnb-typescript}
     */
    'airbnb-typescript/base',
  ],
  rules: {
    // シャドウイングの許容
    '@typescript-eslint/no-shadow': 'off',
  },
});
