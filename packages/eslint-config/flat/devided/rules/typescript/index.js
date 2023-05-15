// FIXME: pluginsもflat-config未対応、対応後@ts-checkを有効にする
import { defineFlatConfig } from 'eslint-define-config';
import * as pluginTypescript from '@typescript-eslint/eslint-plugin';
import airbnb from './airbnb';
import tsdoc from './tsdoc';

export default defineFlatConfig([
  {
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
    plugins: {
      '@typescript-eslint': pluginTypescript,
    },
  },

  ...airbnb,

  {
    rules: {
      ...pluginTypescript.configs['eslint-recommended'].rules,
      ...pluginTypescript.configs['recommended'].rules,
      ...pluginTypescript.configs['recommended-requiring-type-checking'].rules,
      ...pluginTypescript.configs['strict'].rules,

      // 使ってない引数はアンダースコア始まりにする
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],

      // interfaceではなくtypeを使う
      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],

      // EnumではなくUnion typeを使う
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message: "Don't use enums. Use Union type instead.",
        },
      ],
    },
  },

  ...tsdoc,
]);
