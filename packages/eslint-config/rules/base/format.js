// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  plugins: [
    /**
     * eslint-plugin-perfectionist
     * {@link https://www.npmjs.com/package/eslint-plugin-perfectionist}
     */
    'perfectionist',
  ],
  extends: ['plugin:perfectionist/recommended-natural'],
  rules: {
    // コード改行ルール
    'padding-line-between-statements': [
      'warn',
      { blankLine: 'always', prev: '*', next: 'block' },
      { blankLine: 'always', prev: '*', next: 'cjs-export' },
      { blankLine: 'always', prev: '*', next: 'export' },
      { blankLine: 'always', prev: '*', next: 'for' },
      { blankLine: 'always', prev: '*', next: 'function' },
      { blankLine: 'always', prev: '*', next: 'if' },
      { blankLine: 'always', prev: 'import', next: '*' },
      { blankLine: 'never', prev: 'import', next: 'import' },
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: '*', next: 'switch' },
      { blankLine: 'always', prev: '*', next: 'throw' },
      { blankLine: 'always', prev: '*', next: 'try' },
      { blankLine: 'always', prev: '*', next: 'while' },
    ],

    // コメント改行ルール
    'lines-around-comment': [
      'warn',
      {
        beforeBlockComment: true,
        beforeLineComment: true,
        allowBlockStart: true,
        allowObjectStart: true,
        allowClassStart: true,
        allowArrayStart: true,
      },
    ],

    /**
     * import文の並び順
     * {@link https://perfectionist.dev/rules/sort-imports}
     */
    'perfectionist/sort-imports': [
      'error',
      {
        newlinesBetween: 'never',
        internalPattern: ['^@/.*', '^~/'],
      },
    ],
  },
});
