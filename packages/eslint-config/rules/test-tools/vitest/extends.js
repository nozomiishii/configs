// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  overrides: [
    {
      files: ['**/*.test.ts'],
      excludedFiles: '**/e2e/**',
      extends: [
        /**
         * eslint-plugin-vitest
         * {@link https://www.npmjs.com/package/eslint-plugin-vitest}
         */
        'plugin:vitest/all',
      ],
      rules: {
        // DevDependenciesでいい
        'import/no-extraneous-dependencies': 'off',

        // itでなくtest句でテスト書く
        'vitest/consistent-test-it': ['warn', { fn: 'test' }],

        // 同一テスト内で複数expectやめる
        'vitest/max-expects': ['error', { max: 1 }],

        // describeのネストやめる
        'vitest/max-nested-describe': ['error', { max: 1 }],
      },
    },
  ],
});
