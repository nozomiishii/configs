import eslintPluginReactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

/**
 * @returns eslint-plugin-react-refresh
 *
 * @see https://github.com/ArnaudBarre/eslint-plugin-react-refresh
 */
export function reactRefresh() {
  return defineConfig([
    {
      ...eslintPluginReactRefresh.configs.next,
      name: name('react-refresh'),
    },
  ]);
}
