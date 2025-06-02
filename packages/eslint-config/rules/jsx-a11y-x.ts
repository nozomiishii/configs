/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// @ts-expect-error missing types 型がない
import eslintPluginJsxA11yX from 'eslint-plugin-jsx-a11y-x';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

/**
 * @returns eslint-plugin-jsx-a11y-x
 *
 * @see https://github.com/es-tooling/eslint-plugin-jsx-a11y-x
 */
export function jsxA11yX() {
  return defineConfig([
    {
      ...eslintPluginJsxA11yX.flatConfigs.recommended,
      name: name('jsx-a11y-x'),
    },
  ]);
}
