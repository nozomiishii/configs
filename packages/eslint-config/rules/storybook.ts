import type { Linter } from 'eslint';
import eslintPluginStorybook from 'eslint-plugin-storybook';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

const configs = eslintPluginStorybook.configs['flat/recommended'] as unknown as Linter.Config[];
const plugins = configs[0];

/**
 * @returns eslint-plugin-storybook
 *
 * @see https://github.com/storybookjs/storybook/tree/next/code/lib/eslint-plugin
 *
 * 型がぶっ壊れてる
 *
 * @see https://github.com/storybookjs/eslint-plugin-storybook/issues/205
 */
export function storybook() {
  return defineConfig([
    {
      ...plugins,
      ...configs[1],
      ignores: ['!.storybook'],
      name: name('storybook'),
      rules: {
        /**
         * https://github.com/storybookjs/storybook/blob/next/code/lib/eslint-plugin/src/configs/flat/csf-strict.ts
         */
        ...(eslintPluginStorybook.configs['flat/csf-strict'] as unknown as Linter.Config[])[1]?.rules,

        /**
         * https://github.com/storybookjs/storybook/blob/next/code/lib/eslint-plugin/src/configs/flat/recommended.ts
         */
        ...(eslintPluginStorybook.configs['flat/recommended'] as unknown as Linter.Config[])[1]?.rules,
      },
    },
    {
      ...plugins,
      ...configs[2],
      ignores: ['!.storybook'],
      name: name('storybook/add-ons'),
      rules: {
        /**
         * https://github.com/storybookjs/storybook/blob/next/code/lib/eslint-plugin/src/configs/flat/recommended.ts
         */
        ...configs[2]?.rules,
      },
    },
  ]);
}
