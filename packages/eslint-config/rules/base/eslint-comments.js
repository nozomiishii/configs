// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  extends: [
    /**
     * eslint-plugin-eslint-comments
     * {@link https://www.npmjs.com/package/eslint-plugin-eslint-comments}
     */
    'plugin:eslint-comments/recommended',
  ],
  rules: {
    // 'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }]だと'use client'に対応できない
    'eslint-comments/disable-enable-pair': 'off',
  },
});
