import eslintPluginReactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

/**
 * @returns eslint-plugin-react-refresh
 *
 * @see https://github.com/ArnaudBarre/eslint-plugin-react-refresh
 *
 * nextjsと相性よくないかも
 * export const metadataとかが次のエラーで死ぬ
 * Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.
 */
export function reactRefresh() {
  return defineConfig([
    {
      ...eslintPluginReactRefresh.configs.recommended,
      name: name('react-refresh'),
    },
  ]);
}
