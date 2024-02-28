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
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
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

    // Method shorthand syntaxではなくObject property syntaxで関数の型定義する
    // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
    '@typescript-eslint/method-signature-style': ['error', 'property'],

    // EnumではなくTypeを使う
    'no-restricted-syntax': [
      'error',
      {
        selector: 'TSEnumDeclaration',
        message: "Don't use enums. Use Union type instead.",
      },
    ],

    // Promiseをちゃんと処理する。VoidやIIFEは無視してよい。
    '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true, ignoreIIFE: true }],
  },
});
