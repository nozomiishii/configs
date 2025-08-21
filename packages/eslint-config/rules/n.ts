import eslintPluginN from 'eslint-plugin-n';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

const config = eslintPluginN.configs['flat/recommended-module'];

/**
 * @returns eslint-plugin-n
 *
 * @see https://github.com/eslint-community/eslint-plugin-n
 */
export function n() {
  return defineConfig([
    {
      ...config,
      name: name('n'),
      rules: {
        ...config.rules,

        /**
         * typescriptやeslint-plugin-import-xで解決する
         */
        'n/no-missing-import': 'off',
      },
      // pnpmでnode管理したいので設定。engines設定してるならここは省略できる。
      // pnpm.executionEnv.nodeVersionがcustomManagers書いてもenginesと同じタイミングでアップデートしてくれない。
      // pnpmはdevEngines指定になりそう。node versionの固定の仕組みが安定するまで、engines + fnmの運用にする
      // https://github.com/renovatebot/renovate/issues/32632
      //
      // settings: {
      //   node: {
      //     version: getNodeVersion(),
      //   },
      // },
    },

    {
      ignores: ['**/env.ts'],
      name: name('n/no-process-env'),
      rules: {
        /**
         * process.envの直接使用禁止
         *
         * @see https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-process-env.md
         */
        'n/no-process-env': 'error',
      },
    },
  ]);
}
