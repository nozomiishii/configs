// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  extends: [
    /**
     * eslint-config-prettier
     * {@link https://www.npmjs.com/package/eslint-config-prettier}
     */
    'prettier',
  ],
});
