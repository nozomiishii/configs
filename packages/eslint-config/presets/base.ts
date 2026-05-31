import gitignore from "eslint-config-flat-gitignore";
import { defineConfig } from "eslint/config";
import {
  deMorgan,
  eslintComments,
  importX,
  javascript,
  jsdoc,
  perfectionist,
  regexp,
  stylistic,
  typescript,
  unicorn,
  vitest,
} from "../rules";
import { name } from "../utils/name";

/**
 * フレームワーク・ランタイム非依存の言語土台。
 *
 * prettier は含めない。formatting を最後で打ち消す必要があるため、
 * 各 preset が末尾で prettier() を一度だけ付ける。
 *
 * tsconfigRootDirは指定しない。typescript-eslintはeslint.config.tsの
 * あるディレクトリへ自動解決するため、consumer側で正しいrootになる。
 */
export function base() {
  return defineConfig([
    /**
     * eslint-config-flat-gitignore
     * cwdの.gitignoreを読むため、consumer側でも各自の.gitignoreが効く。
     *
     * @see https://github.com/antfu/eslint-config-flat-gitignore
     */
    gitignore(),

    {
      languageOptions: {
        parserOptions: { projectService: true },
      },
      name: name("languageOptions/parserOptions"),
    },

    javascript(),
    typescript(),
    importX(),

    jsdoc(),
    eslintComments(),
    unicorn(),
    deMorgan(),
    regexp(),

    vitest(),

    perfectionist(),
    stylistic(),
  ]);
}
