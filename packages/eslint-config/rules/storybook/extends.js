// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  // デフォルトでは隠しフォルダはESLintの対象にならない。
  // 明示的にignorePatternsでホワイトリストする必要がある。
  ignorePatterns: ['!**/.storybook'],
  overrides: [
    {
      files: ['**/.storybook/**'],
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
        // 明示的に@storybook/testからimportする
        // @types/testing-library__jest-domのせいで勝手にjest.testなどがglobal変数として扱われるため
        'no-restricted-globals': [
          'error',
          {
            name: 'test',
            message: "Use import { test } from '@storybook/test' instead",
          },
          {
            name: 'describe',
            message: "Use import { describe } from '@storybook/test' instead",
          },
          {
            name: 'expect',
            message: "Use import { expect } from '@storybook/test' instead",
          },
        ],

        // FIXME: @storybook/jestから@storybook/testに対応したらonにし直す
        'storybook/use-storybook-expect': 'off',

        /**
         * metaにcomponent渡し忘れ防止
         * {@link https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/csf-component.md}
         */
        'storybook/csf-component': 'error',

        // storybookのrender関数内ではhooksつかっていい
        'react-hooks/rules-of-hooks': 'off',
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
