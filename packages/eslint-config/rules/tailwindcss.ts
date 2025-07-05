import type { Linter } from 'eslint';
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

type Options = {
  entryPoint?: string;
};

/**
 * @returns eslint-plugin-better-tailwindcss
 *
 * @see https://github.com/schoero/eslint-plugin-better-tailwindcss
 */
export function betterTailwindcss(options?: Options) {
  return defineConfig([
    {
      settings: {
        'better-tailwindcss': {
          entryPoint: options?.entryPoint ?? 'src/global.css',
        },
      },
      plugins: {
        'better-tailwindcss': eslintPluginBetterTailwindcss,
      },
      rules: {
        ...(eslintPluginBetterTailwindcss.configs['recommended-warn']?.rules as Linter.Config['rules']),
      },

      name: name('tailwindcss'),
    },
  ]);
}
