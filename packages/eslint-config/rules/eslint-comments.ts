/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { Linter } from 'eslint';
// @ts-expect-error missing types
import eslintPluginEslintComments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

const configs = eslintPluginEslintComments.recommended as unknown as Linter.Config;

/**
 * @returns eslint-plugin-eslint-comments
 * {@link https://github.com/eslint-community/eslint-plugin-eslint-comments}
 *
 * d.tsなくって死んでるのつらい
 * https://github.com/eslint-community/eslint-plugin-eslint-comments/issues/214
 *
 * このルールも入れたい
 * https://github.com/eslint-community/eslint-plugin-eslint-comments/issues/190
 */
export function eslintComments() {
  return defineConfig([
    {
      ...configs,
      name: name('eslint-comments'),
      rules: {
        ...configs.rules,
        // 'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }]だと'use client'に対応できないから下の方がいいかも
        // 'eslint-comments/disable-enable-pair': 'off',
        '@eslint-community/eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
      },
    },
  ]);
}
