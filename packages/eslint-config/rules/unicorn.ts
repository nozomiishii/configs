import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { name } from '../utils/name';

/**
 * @returns eslint-plugin-unicorn
 *
 * @see https://github.com/sindresorhus/eslint-plugin-unicorn
 */
export function unicorn() {
  return defineConfig([
    {
      languageOptions: {
        globals: globals.builtin,
      },
      name: name('unicorn'),
      plugins: {
        unicorn: eslintPluginUnicorn,
      },
      rules: {
        ...eslintPluginUnicorn.configs.recommended.rules,

        /**
         * React Componentやhooksでは条件によってはnullを返せるようにしたいのでoff
         *
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-null.md
         */
        'unicorn/no-null': 'off',

        /**
         * 略語の制限。やるなら明示的にreplacementを記載していく
         *
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prevent-abbreviations.md
         */
        'unicorn/prevent-abbreviations': 'off',
      },
    },
  ]);
}
