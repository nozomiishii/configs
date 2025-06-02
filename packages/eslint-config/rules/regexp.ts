import eslintPluginRegexp from 'eslint-plugin-regexp';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

/**
 * @returns eslint-plugin-regexp
 *
 * @see https://github.com/ota-meshi/eslint-plugin-regexp
 */
export function regexp() {
  return defineConfig([
    {
      ...eslintPluginRegexp.configs['flat/recommended'],
      name: name('regexp'),
    },
  ]);
}
