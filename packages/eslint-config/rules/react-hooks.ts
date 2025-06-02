import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

/**
 * @returns eslint-plugin-react-hooks
 *
 * @see https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks
 */
export function reactHooks() {
  return defineConfig([
    {
      ...eslintPluginReactHooks.configs['recommended-latest'],
      name: name('react-hooks'),
    },
  ]);
}
