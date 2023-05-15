// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  extends: [
    /**
     * @next/eslint-plugin-next
     * {@link https://www.npmjs.com/package/@next/eslint-plugin-next}
     */
    'plugin:@next/next/recommended',
    'plugin:@next/next/core-web-vitals',
  ],
});
