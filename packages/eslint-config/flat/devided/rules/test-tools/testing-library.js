// FIXME: pluginsもrulesもflat-config未対応、対応後@ts-checkを有効にする
import { defineFlatConfig } from 'eslint-define-config';
import * as pluginTestingLibraryReact from 'eslint-plugin-testing-library';
import { rules } from 'eslint-plugin-testing-library/configs/react';

/**
 * {@link https://github.com/testing-library/eslint-plugin-testing-library}}
 */
export default defineFlatConfig([
  {
    files: ['**/*.test.ts', '**/*.stories.ts'],
    ignores: ['**/e2e/**'],
    plugins: {
      'testing-library': pluginTestingLibraryReact,
    },
    rules,
  },
]);
