import type { Linter } from 'eslint';
import pkg from '@next/eslint-plugin-next';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

/**
 * @returns `@next/eslint-plugin-next`
 *
 * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next
 *
 * @see https://nextjs.org/docs/app/api-reference/config/eslint#eslint-plugin
 */
export function nextjs() {
  const { flatConfig: eslintPluginNext } = pkg as unknown as {
    flatConfig: {
      coreWebVitals: Linter.Config;
      recommended: Linter.Config;
    };
  };

  const nextRecommended = eslintPluginNext.recommended;
  const nextCoreWebVitals = eslintPluginNext.coreWebVitals;

  return defineConfig([
    {
      ...nextRecommended,
      ...nextCoreWebVitals,
      name: name('nextjs'),
    },

    {
      /**
       * next-intl越しにnext/linkやnext/navigationを使う
       *
       * @see https://next-intl-docs.vercel.app/docs/workflows/linting#consistent-usage-of-navigation-apis
       */
      name: name('next-intl'),
      rules: {
        'no-restricted-imports': [
          'error',
          {
            message: 'Please import from `libs/next-intl` instead.',
            name: 'next/link',
          },
          {
            importNames: ['getPathname', 'permanentRedirect', 'redirect', 'usePathname', 'useRouter'],
            message: 'Please import from `libs/next-intl` instead.',
            name: 'next/navigation',
          },

          {
            importNames: ['getLocale'],
            message: 'Please import from `libs/next-intl` instead.',
            name: 'next-intl/server',
          },
        ],
      },
    },
  ]);
}
