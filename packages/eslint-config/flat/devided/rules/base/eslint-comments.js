// @ts-check
import { defineFlatConfig } from 'eslint-define-config';
import pluginEslintComments from 'eslint-plugin-eslint-comments';

export default defineFlatConfig([
  {
    rules: {
      /**
       * eslint-plugin-eslint-comments
       * {@link https://github.com/mysticatea/eslint-plugin-eslint-comments}
       */
      ...pluginEslintComments.configs.recommended.rules,
    },
  },
]);
