// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  plugins: [
    /**
     * eslint-plugin-tsdoc
     * {@link https://www.npmjs.com/package/eslint-plugin-tsdoc}
     */
    'tsdoc',
  ],
  rules: {
    /**
     * tsdocのsyntaxチェック
     * {@link https://tsdoc.org/pages/packages/eslint-plugin-tsdoc/}
     */
    'tsdoc/syntax': 'error',
  },
});
