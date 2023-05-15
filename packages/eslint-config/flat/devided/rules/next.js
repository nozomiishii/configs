// FIXME: pluginsもrulesもflat-config未対応、対応後@ts-checkを有効にする
import { defineFlatConfig } from 'eslint-define-config';
import * as pluginNext from '@next/eslint-plugin-next';

/**
 * {@link https://github.com/vercel/next.js/tree/canary/packages/eslint-plugin-next}
 */
export default defineFlatConfig([
  {
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
]);
