// @ts-check
import vitest from './vitest';
import playwright from './playwright';
import storybook from './storybook';
import testingLibrary from './testing-library';
import { defineFlatConfig } from 'eslint-define-config';

export default defineFlatConfig([
  {
    files: ['**/*.test.ts', '**/e2e/**', '**/*.stories.ts'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },

  ...vitest,
  ...testingLibrary,
  ...playwright,
  ...storybook,
]);
