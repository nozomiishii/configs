import { UserConfig } from '@commitlint/types';

/**
 * Configuration
 * {@link https://commitlint.js.org/#/reference-configuration}
 *
 * Rules
 * {@link https://commitlint.js.org/#/reference-rules}
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'chore']],
  },
} satisfies UserConfig;
