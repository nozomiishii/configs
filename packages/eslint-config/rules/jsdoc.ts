import eslintPluginJsdoc from "eslint-plugin-jsdoc";
import { defineConfig } from "eslint/config";
import { name } from "../utils/name";

const configs = eslintPluginJsdoc.configs["flat/recommended-typescript"];

/**
@returns eslint-plugin-jsdoc

@see https://github.com/gajus/eslint-plugin-jsdoc
*/
export function jsdoc() {
  return defineConfig([
    // こだわりが出たらカテゴリ分けして詳しく盆栽する
    // {
    //   ...eslintPluginJsdoc.configs['flat/contents-typescript'],
    //   name: name('jsdoc/contents'),
    // },
    // {
    //   ...eslintPluginJsdoc.configs['flat/logical-typescript'],
    //   name: name('jsdoc/logical'),
    // },
    // {
    //   ...eslintPluginJsdoc.configs['flat/requirements-typescript'],
    //   name: name('jsdoc/requirements'),
    // },
    // {
    //   ...eslintPluginJsdoc.configs['flat/stylistic-typescript'],
    //   name: name('jsdoc/stylistic'),
    // },
    {
      ...configs,
      files: ["**/{lib,libs,utils}/**/*.{ts,tsx}"],
      name: name("jsdoc"),
      rules: {
        ...configs.rules,

        /**
        行頭 `*` なしの書き方では unicorn/no-asterisk-prefix-in-documentation-comments と自動修正がループするため off

        @see https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/check-alignment.md
        */
        "jsdoc/check-alignment": "off",

        /**
        行頭 `*` なしの書き方で、行頭の `**` を prefix と誤認して壊さないようにする

        @see https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/no-multi-asterisks.md
        */
        "jsdoc/no-multi-asterisks": ["warn", { preventAtMiddleLines: false }],

        /**
        jsdoc の自動修正が足す行頭 `*` を消し、unicorn/no-asterisk-prefix-in-documentation-comments に揃える

        @see https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-asterisk-prefix.md
        */
        "jsdoc/require-asterisk-prefix": ["warn", "never"],

        /**
        タグの順番
        */
        "jsdoc/sort-tags": [
          "warn",
          {
            reportIntraTagGroupSpacing: false,
          },
        ],

        /**
        タグのごとにスペース開ける
        */
        "jsdoc/tag-lines": [
          "warn",
          "always",
          {
            applyToEndTag: false,
            startLines: 1,
          },
        ],
      },
    },
  ]);
}
