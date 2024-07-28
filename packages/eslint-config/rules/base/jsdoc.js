// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  plugins: ['jsdoc'],
  extends: [
    /**
     * eslint-plugin-jsdoc
     * {@link https://www.npmjs.com/package/eslint-plugin-jsdoc}
     */
    'plugin:jsdoc/recommended-typescript',
  ],
  rules: {
    // 説明文必須
    'jsdoc/no-blank-blocks': ['warn', { enableFixer: false }],

    // TSDoc 特有のタグを使用可能にする
    'jsdoc/check-tag-names': [
      'error',
      {
        definedTags: ['typeParam', 'remarks'],
      },
    ],

    // paramはtypescriptに任せる
    'jsdoc/require-param': 'off',

    // 戻り値はtypescriptに任せる
    'jsdoc/require-returns': 'off',

    // タグのごとにスペース開ける
    'jsdoc/tag-lines': [
      'warn',
      'always',
      {
        startLines: 1,
        applyToEndTag: false,
      },
    ],

    // タグの順番
    'jsdoc/sort-tags': [
      'warn',
      {
        reportIntraTagGroupSpacing: false,
      },
    ],

    // overridesで適用するディレクトリ指定する
    'jsdoc/require-jsdoc': 'off',
  },
  overrides: [
    {
      files: ['**/utils/**', '**/libs/**'],
      rules: {
        // 必須にする項目の設定
        'jsdoc/require-jsdoc': [
          'error',
          {
            contexts: [
              // Interfaceのプロパティ
              'TSPropertySignature',

              // Interfaceのメソッド
              'TSMethodSignature',

              // interface
              // 'TSInterfaceDeclaration',

              // type
              // 'TSTypeAliasDeclaration',

              // enum
              // 'TSEnumDeclaration',
            ],
          },
        ],
      },
    },
    {
      files: ['**/*.test.ts', '**/*.spec.ts'],
      rules: {
        // テストファイルではrequire-jsdocをoffにする
        'jsdoc/require-jsdoc': 'off',
      },
    },
  ],
});
