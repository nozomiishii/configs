// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  settings: {
    'import/resolver': {
      typescript: true,
    },
  },
  extends: [
    require.resolve('./airbnb'),
    /**
     * @typescript-eslint/eslint-plugin
     * {@link https://www.npmjs.com/package/@typescript-eslint/eslint-plugin}
     */
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
    require.resolve('./tsdoc'),
  ],
  rules: {
    // 使ってない引数はアンダースコア始まりにする
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
      },
    ],

    // interfaceではなくtypeを使う
    '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],

    // EnumではなくTypeを使う
    'no-restricted-syntax': [
      'error',
      {
        selector: 'TSEnumDeclaration',
        message: "Don't use enums. Use Union type instead.",
      },
    ],

    // auto fixがまだ対応してない
    // https://github.com/typescript-eslint/typescript-eslint/issues/2296
    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: {
          memberTypes: ['signature', 'field', 'static-initialization', 'constructor', 'get', 'set', 'method'],
          optionalityOrder: 'required-first',
          order: 'natural',
        },
      },
    ],

    // Union TypesとIntersection Typesの並び順
    '@typescript-eslint/sort-type-constituents': 'warn',
  },
});
