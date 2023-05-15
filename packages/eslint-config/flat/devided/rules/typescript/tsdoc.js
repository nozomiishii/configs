// @ts-check
import { defineFlatConfig } from 'eslint-define-config';
import pluginTsdoc from 'eslint-plugin-tsdoc';

export default defineFlatConfig([
  {
    plugins: {
      /**
       * eslint-plugin-tsdoc
       * {@link https://www.npmjs.com/package/eslint-plugin-tsdoc}
       */
      tsdoc: pluginTsdoc,
    },
    rules: {
      /**
       * tsdocのsyntaxチェック
       * {@link https://tsdoc.org/pages/packages/eslint-plugin-tsdoc/}
       */
      'tsdoc/syntax': 'error',
    },
  },
]);
