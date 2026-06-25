import eslintPluginUnicorn from "eslint-plugin-unicorn";
import { defineConfig } from "eslint/config";
import globals from "globals";
import { name } from "../utils/name";

/**
 * @returns eslint-plugin-unicorn
 *
 * @see https://github.com/sindresorhus/eslint-plugin-unicorn
 */
export function unicorn() {
  return defineConfig([
    {
      languageOptions: {
        globals: globals.builtin,
      },
      name: name("unicorn"),
      plugins: {
        unicorn: eslintPluginUnicorn,
      },
      rules: {
        ...eslintPluginUnicorn.configs.recommended.rules,

        /**
         * 略語の制限。やるなら明示的にreplacementを記載していく
         *
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/name-replacements.md
         */
        "unicorn/name-replacements": "off",

        /**
         * React Componentやhooksでは条件によってはnullを返せるようにしたいのでoff
         *
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-null.md
         */
        "unicorn/no-null": "off",

        /**
         * import + 同名 re-export の bulk pattern を許可（local でも使っている場合のみ）
         * pure re-export は引き続き `export ... from` を強制
         *
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-export-from.md
         */
        "unicorn/prefer-export-from": "error",
      },
    },

    {
      /**
       * router.replace() など String#replace() 以外の .replace() メソッドで false positive が発生する
       *
       * @see https://github.com/sindresorhus/eslint-plugin-unicorn/issues/3437
       */
      name: name("unicorn/workaround"),
      rules: {
        "unicorn/no-unsafe-string-replacement": "off",
      },
    },

    {
      /**
       * Next.js の instrumentation-client は Sentry, PostHog, Datadog RUM でトップレベル副作用関数を呼ぶ必要がある
       *
       * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-top-level-side-effects.md
       * @see https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client
       */
      files: ["**/instrumentation-client.ts"],
      name: name("unicorn/instrumentation-client"),
      rules: {
        "unicorn/no-top-level-side-effects": "off",
      },
    },
  ]);
}
