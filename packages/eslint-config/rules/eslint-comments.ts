import eslintPluginEslintComments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import { defineConfig } from "eslint/config";
import { name } from "../utils/name";

const configs = eslintPluginEslintComments.recommended;

/**
 * @returns eslint-plugin-eslint-comments
 * {@link https://github.com/eslint-community/eslint-plugin-eslint-comments}
 */
export function eslintComments() {
  return defineConfig([
    {
      ...configs,
      name: name("eslint-comments"),
      rules: {
        ...configs.rules,
        "@eslint-community/eslint-comments/disable-enable-pair": [
          "error",
          { allowWholeFile: true },
        ],
        /**
         * disable コメント自体を禁止する。ただし no-use 自身を巻き込んで
         * disable すれば bypass できるため、base preset の noInlineConfig と
         * 併用して抜け道を塞ぐ。
         */
        "@eslint-community/eslint-comments/no-use": "error",
      },
    },
  ]);
}
