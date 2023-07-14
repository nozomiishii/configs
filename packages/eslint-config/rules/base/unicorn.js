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
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {
        // React Componentでは条件によってはnullを返せるようにしたい
        'unicorn/no-null': 'off',
      },
    },
  ],
});
