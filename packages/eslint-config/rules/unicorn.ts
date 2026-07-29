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

        /**
         * Encoding Standard が名乗る側を `utf-8` に固定しているため dash 付きに揃える。
         * 既定の `utf8` は Node のショートハンドで、HTML の meta charset や
         * HTTP header に出すと規格から外れる。Node は両方受け付ける。
         *
         * @see https://encoding.spec.whatwg.org/#names-and-labels
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/text-encoding-identifier-case.md
         */
        "unicorn/text-encoding-identifier-case": ["error", { withDash: true }],
      },
    },
  ]);
}
