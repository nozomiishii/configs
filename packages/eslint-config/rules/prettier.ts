import eslintConfigPrettier from 'eslint-config-prettier/flat';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

/**
 * @returns eslint-config-prettier
 *
 * @see https://github.com/prettier/eslint-config-prettier
 */
export function prettier() {
  return defineConfig([
    {
      ...eslintConfigPrettier,
      name: name('prettier'),
    },
  ]);
}
