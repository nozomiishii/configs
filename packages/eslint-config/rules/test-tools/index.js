// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  extends: [
    require.resolve('./vitest'),
    require.resolve('./testing-library'),
    require.resolve('./playwright'),
    require.resolve('./storybook'),
  ],
  overrides: [
    {
      files: ['**/*.test.ts', '**/e2e/**', '**/*.stories.ts'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
});
