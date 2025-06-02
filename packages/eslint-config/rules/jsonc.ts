// import eslintPluginJsonc from 'eslint-plugin-jsdoc';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

/**
 * @returns eslint-plugin-jsonc
 *
 * @see https://github.com/ota-meshi/eslint-plugin-jsonc
 *
 * 型がぶっ壊れてる
 *
 * @see https://github.com/ota-meshi/eslint-plugin-jsonc/issues/385
 */
export function perfectionist() {
  return defineConfig([
    {
      // slintPluginJsonc.configs['flat/recommended-with-jsonc'],
      name: name('jsonc'),
      rules: {
        // rules: {
        //   'jsonc/require-properties': [
        //     'error',
        //     {
        //       properties: ['packageManager', 'pnpm.executionEnv.nodeVersion'],
        //     },
        //   ],
        // },

        /**
         * Keyの並び順
         *
         * @see https://ota-meshi.github.io/eslint-plugin-jsonc/rules/sort-keys.html#jsonc-sort-keys
         */
        'jsonc/sort-keys': 'warn',
      },
    },
  ]);
}
