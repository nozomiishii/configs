// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  ignorePatterns: ['!**/.storybook'],
  overrides: [
    {
      files: ['**/.storybook/**', '**/.storybook**'],
      rules: {
        // DevDependenciesでいい
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
        // 明示的にvitestからimportする
        // @types/testing-library__jest-domのせいで勝手にjest.testなどがglobal変数として扱われるため
        'no-restricted-globals': [
          'error',
          {
            name: 'test',
            message: "Use import { test } from '@storybook/jest' instead",
          },
          {
            name: 'describe',
            message: "Use import { describe } from '@storybook/jest' instead",
          },
          {
            name: 'expect',
            message: "Use import { expect } from '@storybook/jest' instead",
          },
        ],

        /**
         * metaにcomponent渡し忘れ防止
         * {@link https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/csf-component.md}
         */
        'storybook/csf-component': 'error',
      },
    },
    {
      files: ['**/.storybook/main.*'],
      rules: {
        /**
         * addonのinstall漏れ防止
         * {@link https://github.com/storybookjs/eslint-plugin-storybook/blob/HEAD/docs/rules/no-uninstalled-addons.md}
         */
        'storybook/no-uninstalled-addons': 'error',
      },
    },
  ],
});
