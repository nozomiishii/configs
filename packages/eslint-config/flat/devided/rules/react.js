// FIXME: pluginsもrulesもflat-config未対応、対応後@ts-checkを有効にする
import { defineFlatConfig } from 'eslint-define-config';
import * as pluginReact from 'eslint-plugin-react';
import * as pluginReactHooks from 'eslint-plugin-react-hooks';
import * as pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import * as styleGuideVercelReact from '@vercel/style-guide/eslint/rules/react';

/**
 * {@link https://github.com/prettier/eslint-config-prettier}
 */
export default defineFlatConfig([
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      'jsx-a11y': pluginJsxA11y,
      react: pluginReact,
      'react-hooks': pluginReactHooks,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs['jsx-runtime'].rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,

      ...styleGuideVercelReact.rules,
    },
  },
]);
