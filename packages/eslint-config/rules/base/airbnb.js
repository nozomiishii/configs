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
    // ++表現不可。for文内では++表現可
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],

    // ./format.jsで定義
    'import/order': 'off',

    // Default exportの強制はしない
    'import/prefer-default-export': 'off',
  },
});
