import eslintPluginJsdoc from 'eslint-plugin-jsdoc';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

const configs = eslintPluginJsdoc.configs['flat/recommended-typescript'];

/**
 * @returns eslint-plugin-jsdoc
 *
 * @see https://github.com/gajus/eslint-plugin-jsdoc
 */
export function jsdoc() {
  return defineConfig([
    // こだわりが出たらカテゴリ分けして詳しく盆栽する
    // {
    //   ...eslintPluginJsdoc.configs['flat/contents-typescript'],
    //   name: name('jsdoc/contents'),
    // },
    // {
    //   ...eslintPluginJsdoc.configs['flat/logical-typescript'],
    //   name: name('jsdoc/logical'),
    // },
    // {
    //   ...eslintPluginJsdoc.configs['flat/requirements-typescript'],
    //   name: name('jsdoc/requirements'),
    // },
    // {
    //   ...eslintPluginJsdoc.configs['flat/stylistic-typescript'],
    //   name: name('jsdoc/stylistic'),
    // },
    {
      ...configs,
      files: ['**/libs/**/*.ts', '**/utils/**/*.tsx'],
      name: name('jsdoc'),
      rules: {
        ...configs.rules,

        /**
         * タグの順番
         */
        'jsdoc/sort-tags': [
          'warn',
          {
            reportIntraTagGroupSpacing: false,
          },
        ],

        /**
         * タグのごとにスペース開ける
         */
        'jsdoc/tag-lines': [
          'warn',
          'always',
          {
            applyToEndTag: false,
            startLines: 1,
          },
        ],
      },
    },
  ]);
}
