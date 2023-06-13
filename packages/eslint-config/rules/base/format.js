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
     * eslint-plugin-sort
     * {@link https://www.npmjs.com/package/eslint-plugin-sort}
     */
    'sort',
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
    // // import文の並び替え
    // 'import/order': [
    //   'warn',
    //   {
    //     alphabetize: { caseInsensitive: true, order: 'asc' },
    //     groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
    //     pathGroups: [
    //       {
    //         pattern: '~/**',
    //         group: 'internal',
    //       },
    //       {
    //         pattern: '@/**',
    //         group: 'internal',
    //       },
    //     ],
    //     'newlines-between': 'never',
    //   },
    // ],

    // import句の後改行する
    'import/newline-after-import': ['warn', { considerComments: true }],

    /**
     * 分割代入の並び替え
     * @see {@link https://github.com/mskelton/eslint-plugin-sort/blob/HEAD/docs/rules/destructuring-properties.md}
     */
    'sort/destructuring-properties': ['warn', { caseSensitive: false, natural: true }],

    /**
     * export句の並び替え
     * @see {@link https://github.com/mskelton/eslint-plugin-sort/blob/main/docs/rules/exports.md}
     */
    'sort/exports': [
      'warn',
      {
        groups: [
          { type: 'dependency', order: 10 },
          { type: 'other', order: 20 },
          { type: 'sourceless', order: 30 },
          { type: 'default', order: 40 },
        ],
        caseSensitive: false,
        natural: true,
      },
    ],

    /**
     * export句のオブジェクト並び替え
     * @see {@link https://github.com/mskelton/eslint-plugin-sort/blob/main/docs/rules/export-members.md}
     */
    'sort/export-members': ['warn', { caseSensitive: false, natural: true }],

    /**
     * import句の並び替え
     * @see {@link https://github.com/mskelton/eslint-plugin-sort/blob/main/docs/rules/imports.md}
     */
    'sort/imports': [
      'warn',
      {
        groups: [
          { type: 'side-effect', order: 10 },
          { type: 'dependency', order: 20 },
          { type: 'other', order: 30 },
        ],
        caseSensitive: false,
        natural: true,
      },
    ],

    /**
     * import句のオブジェクト並び替え
     * @see {@link https://github.com/mskelton/eslint-plugin-sort/blob/HEAD/docs/rules/import-members.md}
     */
    'sort/import-members': ['warn', { caseSensitive: false, natural: true }],

    /**
     * オブジェクト並び替え
     * @see {@link https://github.com/mskelton/eslint-plugin-sort/blob/HEAD/docs/rules/object-properties.md}
     */
    'sort/object-properties': ['warn', { caseSensitive: false, natural: true }],
  },
});
