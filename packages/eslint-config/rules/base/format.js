// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  plugins: [
    /**
     * eslint-plugin-import
     * {@link https://www.npmjs.com/package/eslint-plugin-import}
     */
    'import',

    /**
     * eslint-plugin-sort-keys-custom-order
     * {@link https://www.npmjs.com/package/eslint-plugin-sort-keys-custom-order}
     */
    'sort-keys-custom-order',
  ],
  rules: {
    // return句の改行ルール
    'padding-line-between-statements': [
      'warn',
      {
        blankLine: 'always',
        next: 'return',
        prev: '*',
      },
    ],

    // import句の後改行する
    'import/newline-after-import': ['warn', { considerComments: true }],

    // import文の並び替え
    'import/order': [
      'warn',
      {
        alphabetize: { caseInsensitive: true, order: 'asc' },
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'object', 'type', 'index'],
        'newlines-between': 'never',
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],

    /**
     * keyを並び替え
     * {@link https://github.com/hugoattal/eslint-plugin-sort-keys-custom-order}
     */
    'sort-keys-custom-order/export-object-keys': [
      'warn',
      {
        orderedKeys: ['id', 'key', 'name', 'title', 'default'],
      },
    ],
    'sort-keys-custom-order/import-object-keys': [
      'warn',
      {
        orderedKeys: ['id', 'key', 'name', 'title', 'default'],
      },
    ],
    'sort-keys-custom-order/object-keys': [
      'warn',
      {
        orderedKeys: ['id', 'key', 'name', 'title', 'default'],
      },
    ],
    'sort-keys-custom-order/type-keys': [
      'warn',
      {
        orderedKeys: ['id', 'key', 'name', 'title', 'default'],
      },
    ],
  },
});
