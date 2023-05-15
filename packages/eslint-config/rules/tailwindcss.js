// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  extends: [
    /**
     * eslint-plugin-tailwindcss
     * {@link https://www.npmjs.com/package/eslint-plugin-tailwindcss}
     */
    'plugin:tailwindcss/recommended',
  ],
});
