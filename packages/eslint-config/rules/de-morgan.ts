import eslintPluginDeMorgan from 'eslint-plugin-de-morgan';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

/**
 * @returns eslint-plugin-de-morgan
 *
 * @see https://github.com/azat-io/eslint-plugin-de-morgan
 */
export function deMorgan() {
  return defineConfig([
    {
      ...eslintPluginDeMorgan.configs.recommended,
      name: name('de-morgan'),
    },
  ]);
}
