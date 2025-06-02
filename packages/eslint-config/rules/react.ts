import eslintPluginReact from '@eslint-react/eslint-plugin';
import { type Linter } from 'eslint';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

const configs = eslintPluginReact.configs['recommended-type-checked'] as unknown as Linter.Config;

/**
 * @returns `@eslint-react/eslint-plugin`
 *
 * @see https://github.com/Rel1cx/eslint-react
 */
export function react() {
  return defineConfig([
    {
      // https://github.com/Rel1cx/eslint-react/blob/main/packages/plugins/eslint-plugin/src/configs/recommended-type-checked.ts
      ...configs,
      name: name('react/recommended-type-checked'),
      rules: {
        ...configs.rules,
      },
    },
  ]);
}
