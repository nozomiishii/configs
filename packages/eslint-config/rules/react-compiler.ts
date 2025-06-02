import eslintPluginReactCompiler from 'eslint-plugin-react-compiler';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

/**
 * @returns eslint-plugin-react-compiler
 *
 * @see https://github.com/facebook/react/tree/main/compiler/packages/eslint-plugin-react-compiler
 */
export function reactCompiler() {
  return defineConfig([
    {
      ...eslintPluginReactCompiler.configs.recommended,
      name: name('react-compiler'),
    },
  ]);
}
