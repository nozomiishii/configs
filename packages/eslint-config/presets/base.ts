import gitignore from "eslint-config-flat-gitignore";
import { defineConfig } from "eslint/config";
import { deMorgan } from "../rules/de-morgan";
import { eslintComments } from "../rules/eslint-comments";
import { importX } from "../rules/import-x";
import { javascript } from "../rules/javascript";
import { jsdoc } from "../rules/jsdoc";
import { perfectionist } from "../rules/perfectionist";
import { prettier } from "../rules/prettier";
import { regexp } from "../rules/regexp";
import { stylistic } from "../rules/stylistic";
import { typescript } from "../rules/typescript";
import { unicorn } from "../rules/unicorn";
import { viest } from "../rules/viest";
import { name } from "../utils/name";

/**
 * フレームワーク・ランタイム非依存の言語土台。
 * node / nextjs はこれを内包する。
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

    viest(),

    perfectionist(),
    stylistic(),
    prettier(),
  ]);
}
