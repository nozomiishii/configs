import eslintPluginPackageJson from 'eslint-plugin-package-json';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

/**
 * @returns eslint-plugin-package-json
 *
 * @see https://github.com/JoshuaKGoldberg/eslint-plugin-package-json
 */
export function packageJson() {
  return defineConfig([
    {
      // https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/blob/main/src/index.ts
      ...eslintPluginPackageJson.configs.recommended,
      name: name('package-json'),
    },
  ]);
}
