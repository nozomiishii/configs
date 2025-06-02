import eslintPluginPerfectionist from 'eslint-plugin-perfectionist';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

/**
 * @returns eslint-plugin-perfectionist
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export function perfectionist() {
  return defineConfig([
    {
      name: name('perfectionist'),
      plugins: {
        perfectionist: eslintPluginPerfectionist,
      },
      rules: {
        ...eslintPluginPerfectionist.configs['recommended-natural'].rules,

        /**
         * import文の並び順
         *
         * @see https://perfectionist.dev/rules/sort-imports
         */
        'perfectionist/sort-imports': [
          'error',
          {
            newlinesBetween: 'never',
          },
        ],
      },
    },
  ]);
}
