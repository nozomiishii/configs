import gitignore from "eslint-config-flat-gitignore";
import { defineConfig } from "eslint/config";
import type { Options } from "../types";
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
 * projectService と tsconfigRootDir は typescript() が持つ。
 * tsconfigRootDir は options.typescript 経由で consumer が渡す。
 */
export function base(options: Options = {}) {
  return defineConfig([
    /**
     * eslint-config-flat-gitignore
     * cwdの.gitignoreを読むため、consumer側でも各自の.gitignoreが効く。
     *
     * @see https://github.com/antfu/eslint-config-flat-gitignore
     */
    gitignore(),

    /**
     * inline の disableコメントを無効化。必ずeslint.config.tsで設定の変更はする。
     *
     * @see https://eslint.org/docs/latest/use/configure/rules
     */
    {
      linterOptions: { noInlineConfig: true },
      name: name("linterOptions"),
    },

    javascript(),
    typescript(options.typescript),
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
