import eslintPluginStylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

/**
 * @returns @stylistic/eslint-plugin
 *
 * @see https://eslint.style/rules
 */
export function stylistic() {
  return defineConfig([
    {
      name: name('stylistic'),
      plugins: {
        '@stylistic': eslintPluginStylistic,
      },
      rules: {
        /**
         * 改行のルールの統一
         *
         * @see https://eslint.org/docs/latest/rules/padding-line-between-statements#rule-details
         */
        '@stylistic/padding-line-between-statements': [
          'warn',
          { blankLine: 'always', next: 'block', prev: '*' },
          { blankLine: 'always', next: 'function', prev: '*' },
          { blankLine: 'always', next: 'export', prev: '*' },
          { blankLine: 'always', next: 'for', prev: '*' },
          { blankLine: 'always', next: 'if', prev: '*' },
          { blankLine: 'always', next: '*', prev: 'import' },
          { blankLine: 'never', next: 'import', prev: 'import' },
          { blankLine: 'always', next: 'return', prev: '*' },
          { blankLine: 'always', next: 'switch', prev: '*' },
          { blankLine: 'always', next: 'throw', prev: '*' },
          { blankLine: 'always', next: 'try', prev: '*' },
          { blankLine: 'always', next: 'while', prev: '*' },
        ],
      },
    },
  ]);
}
