import eslintPluginReact from '@eslint-react/eslint-plugin';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

/**
 * @returns `@eslint-react/eslint-plugin`
 *
 * @see https://github.com/Rel1cx/eslint-react
 */
export function react() {
  return defineConfig([
    {
      // https://github.com/Rel1cx/eslint-react/blob/main/packages/plugins/eslint-plugin/src/configs/recommended-type-checked.ts
      ...eslintPluginReact.configs['recommended-type-checked'],
      name: name('react/recommended-type-checked'),
    },
  ]);
}
