import gitignore from 'eslint-config-flat-gitignore';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { deMorgan } from './rules/de-morgan';
import { eslintComments } from './rules/eslint-comments';
import { importX } from './rules/import-x';
import { javascript } from './rules/javascript';
import { jsdoc } from './rules/jsdoc';
import { jsxA11yX } from './rules/jsx-a11y-x';
import { n } from './rules/n';
import { nextjs } from './rules/nextjs';
import { perfectionist } from './rules/perfectionist';
import { playwright } from './rules/playwright';
import { prettier } from './rules/prettier';
import { react } from './rules/react';
// import { reactCompiler } from './rules/react-compiler';
import { reactHooks } from './rules/react-hooks';
// import { reactRefresh } from './rules/react-refresh';
import { regexp } from './rules/regexp';
import { storybook } from './rules/storybook';
import { betterTailwindcss } from './rules/tailwindcss';
import { typescript } from './rules/typescript';
import { unicorn } from './rules/unicorn';
import { viest } from './rules/viest';
import { name } from './utils/name';

export default defineConfig([
  /**
   * eslint-config-flat-gitignore
   *
   * @see https://github.com/antfu/eslint-config-flat-gitignore
   */
  gitignore(),

  {
    // パーサー設定する必要あるかも
    // https://github.com/Rel1cx/eslint-react?tab=readme-ov-file#setup
    languageOptions: {
      /**
       * globals
       * グローバル変数の設定
       * 例えば、document や process といった変数をコード中で使っても、
       * ESLintが「未定義の変数です」というエラーを出さないようにする
       */
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    name: name('languageOptions/globals'),
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    name: name('languageOptions/parserOptions'),
  },

  javascript(),
  typescript(),
  importX(),
  n(),

  jsdoc(),
  eslintComments(),
  unicorn(),
  deMorgan(),
  regexp(),

  react(),
  //  Cannot read properties of undefined (reading 'configs')てなる
  // reactCompiler(),
  reactHooks(),
  // reactRefresh(),
  jsxA11yX(),

  nextjs(),
  betterTailwindcss(),

  viest(),
  storybook(),
  playwright(),

  perfectionist(),
  prettier(),

  // jsdoc()
  // packageJson()
]);

export { defineConfig } from 'eslint/config';
