// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  overrides: [
    {
      files: ['**/*.stories.*', '**/.storybook/main.*'],
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
      },
    },
  ],
});
