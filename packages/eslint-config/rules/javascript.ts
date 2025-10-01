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
         * 比較式において、リテラルを前に置く「ヨーダ条件」を禁止
         *
         * @see https://eslint.org/docs/latest/rules/yoda
         */
        yoda: 'warn',
      },
    },
  ]);
}
