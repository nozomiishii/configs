// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  extends: [
    /**
     * @tanstack/eslint-plugin-query
     * {@link https://www.npmjs.com/package/@tanstack/eslint-plugin-query}
     */
    'plugin:@tanstack/eslint-plugin-query/recommended',
  ],
});
