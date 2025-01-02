// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  extends: [
    /**
     * eslint-plugin-unicorn
     * {@link https://www.npmjs.com/package/eslint-plugin-unicorn}
     */
    'plugin:unicorn/recommended',
  ],
  rules: {
    // 略語の制限は今のところしなくてもいい。やるなら明示的にreplacementを記載していく
    'unicorn/prevent-abbreviations': 'off',

    // React Componentやhooksでは条件によってはnullを返せるようにしたい
    'unicorn/no-null': 'off',

    /**
     * TODOやFIXMEには期限をつける
     * {@link https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/expiring-todo-comments.md}
     */
    'unicorn/expiring-todo-comments': [
      'error',
      {
        allowWarningComments: false,
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.test.{ts,tsx}'],
      rules: {
        /**
         * テストファイルではスコープ内でmock関数を定義したい
         * {@link https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-function-scoping.md}
         */
        'unicorn/consistent-function-scoping': 'off',
      },
    },
  ],
});
