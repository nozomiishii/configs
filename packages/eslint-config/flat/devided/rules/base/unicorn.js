// FIXME: pluginsのflat-config未対応、対応後@ts-checkを有効にする
import { defineFlatConfig } from 'eslint-define-config';
import * as pluginUnicorn from 'eslint-plugin-unicorn';

export default defineFlatConfig([
  {
    plugins: {
      /**
       * {@link https://github.com/sindresorhus/eslint-plugin-unicorn}
       */
      unicorn: pluginUnicorn,
    },
    rules: {
      ...pluginUnicorn.configs.recommended.rules,

      // 略語の許容
      'unicorn/prevent-abbreviations': [
        'warn',
        {
          replacements: {
            args: {
              arguments: false,
            },
            env: {
              environment: false,
            },
            e: {
              event: false,
            },
            props: {
              properties: false,
            },
            req: {
              request: false,
            },
            res: {
              response: false,
            },
          },
        },
      ],
    },
  },
]);
