// @ts-check
import { defineFlatConfig } from 'eslint-define-config';
import globals from 'globals';
import format from './format';
import eslintComments from './eslint-comments';
import unicorn from './unicorn';
import airbnb from './airbnb';

export default defineFlatConfig([
  {
    settings: {
      'import/resolver': { node: true },
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
  ...airbnb,
  ...unicorn,
  ...eslintComments,
  ...format,
]);
