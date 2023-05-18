// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  extends: [
    /**
     * eslint-config-airbnb-base
     * {@link https://github.com/airbnb/javascript}
     */
    'airbnb-base',
  ],
  rules: {
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
  },
});
