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
    // 略語の許容
    'unicorn/prevent-abbreviations': [
      'warn',
      {
        replacements: {
          args: false,
          env: false,
          e: false,
          props: false,
          req: false,
          res: false,
          ref: false,
        },
      },
    ],
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
