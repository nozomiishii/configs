import eslintConfigJavascript from '@eslint/js';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

/**
 * @returns @eslint/js
 *
 * @see https://eslint.org/docs/latest/rules/
 */
export function javascript() {
  return defineConfig([
    {
      files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
      name: name('javascript'),
      plugins: {
        js: eslintConfigJavascript,
      },
      rules: {
        ...eslintConfigJavascript.configs.recommended.rules,
        /**
         * if, else, while, for などで波括弧を省略しないように統一
         *
         * @see https://github.com/prettier/eslint-config-prettier?tab=readme-ov-file#curly
         */
        curly: ['warn', 'all'],

        /**
         * == と != の使用を禁止し、=== と !== の使用を強制
         *
         * @see https://eslint.org/docs/latest/rules/eqeqeq
         */
        eqeqeq: ['warn', 'allow-null'],

        // コメント改行ルール
        // 'lines-around-comment': [
        //   'warn',
        //   {
        //     allowArrayStart: true,
        //     allowBlockStart: true,
        //     allowClassStart: true,
        //     allowObjectStart: true,
        //     beforeBlockComment: true,
        //     beforeLineComment: true,
        //   },
        // ],

        /**
         * consoleの消し忘れ防止
         *
         * @see https://eslint.org/docs/latest/rules/no-console
         */
        'no-console': ['warn', { allow: ['warn', 'error'] }],

        /**
         * 不必要な再命名防止
         *
         * @see https://eslint.org/docs/latest/rules/no-useless-rename
         */
        'no-useless-rename': 'warn',

        /**
         * 改行のルールの統一
         *
         * @see https://eslint.org/docs/latest/rules/padding-line-between-statements#rule-details
         */
        'padding-line-between-statements': [
          'warn',
          { blankLine: 'always', next: 'block', prev: '*' },
          { blankLine: 'always', next: 'function', prev: '*' },
          { blankLine: 'always', next: 'cjs-export', prev: '*' },
          { blankLine: 'always', next: 'export', prev: '*' },
          { blankLine: 'always', next: 'for', prev: '*' },
          { blankLine: 'always', next: '*', prev: 'import' },
          { blankLine: 'always', next: 'if', prev: '*' },
          { blankLine: 'never', next: 'import', prev: 'import' },
          { blankLine: 'always', next: 'return', prev: '*' },
          { blankLine: 'always', next: 'switch', prev: '*' },
          { blankLine: 'always', next: 'throw', prev: '*' },
          { blankLine: 'always', next: 'try', prev: '*' },
          { blankLine: 'always', next: 'while', prev: '*' },
        ],

        /**
         * 比較式において、リテラルを前に置く「ヨーダ条件」を禁止
         *
         * @see https://eslint.org/docs/latest/rules/yoda
         */
        yoda: 'warn',
      },
    },
  ]);
}
