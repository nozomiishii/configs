// FIXME: pluginsもrulesもflat-config未対応、対応後@ts-checkを有効にする
import { defineFlatConfig } from 'eslint-define-config';
const pluginTailwind = require('eslint-plugin-tailwindcss');

/**
 * {@link https://github.com/francoismassart/eslint-plugin-tailwindcss}
 */
export default defineFlatConfig([
  {
    plugins: {
      tailwindcss: pluginTailwind,
    },
    rules: pluginTailwind.configs.recommended.rules,
  },
]);
