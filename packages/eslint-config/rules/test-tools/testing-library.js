// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.stories.ts'],
      excludedFiles: '**/e2e/**',
      extends: [
        /**
         * eslint-plugin-testing-library
         * {@link https://www.npmjs.com/package/eslint-plugin-testing-library}
         */
        'plugin:testing-library/react',
      ],
    },
  ],
});
