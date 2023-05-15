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
          args: {
            arguments: false,
          },
          env: {
            environment: false,
          },
          e: {
            event: false,
          },
          props: {
            properties: false,
          },
          req: {
            request: false,
          },
          res: {
            response: false,
          },
        },
      },
    ],
  },
});
