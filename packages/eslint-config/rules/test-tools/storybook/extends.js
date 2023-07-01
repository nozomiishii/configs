// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  overrides: [
    {
      files: ['**/.storybook/**', '**/.storybook**'],
      rules: {
        // devDependenciesで良い
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['**/*.stories.*'],
      extends: [
        /**
         * eslint-plugin-storybook
         * {@link https://www.npmjs.com/package/eslint-plugin-storybook}
         */
        'plugin:storybook/recommended',
        'plugin:storybook/csf-strict',
      ],
      rules: {
        /**
         * metaにcomponent渡し忘れ防止
         * {@link https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/csf-component.md}
         */
        'storybook/csf-component': 'error',

        // testing LibraryのuserEventの戻り値の型がpromiseではないがawaitで書かないと予期した挙動にならない
        '@typescript-eslint/await-thenable': 'off',
      },
    },
  ],
});
