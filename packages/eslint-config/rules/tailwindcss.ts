/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// @ts-expect-error missing types 型がない
import eslintPluginTailwindcss from 'eslint-plugin-tailwindcss';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

/**
 * @returns eslint-plugin-tailwindcss
 *
 * @see https://github.com/francoismassart/eslint-plugin-tailwindcss
 */
export function tailwindcss() {
  return defineConfig([
    {
      // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/lib/config/flat-recommended.js
      ...eslintPluginTailwindcss.configs['flat/recommended'][0],
      ...eslintPluginTailwindcss.configs['flat/recommended'][1],
      name: name('tailwindcss'),
    },
  ]);
}
