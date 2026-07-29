import tanstackRouterPlugin from "@tanstack/eslint-plugin-router";
import { defineConfig } from "eslint/config";
import { name } from "../utils/name";

const config = tanstackRouterPlugin.configs["flat/recommended"][0];

/**
 * @returns `@tanstack/eslint-plugin-router`
 *
 * どのruleもTanStack Routerのimportがあるファイルだけを見るため、filesで絞らない。
 *
 * @see https://tanstack.com/router/latest/docs/eslint/eslint-plugin-router
 * @see https://github.com/TanStack/router/tree/main/packages/eslint-plugin-router
 */
export function tanstackRouter() {
  return defineConfig([
    {
      ...config,
      name: name("tanstack-router"),
    },

    {
      name: name("tanstack-router/only-throw-error"),
      rules: {
        /**
         * TanStack RouterはredirectとnotFoundをthrowして制御を移す。
         * baseのstrictTypeCheckedがonly-throw-errorをerrorにしているため、
         * この2つだけthrowできる型として許可する。
         *
         * @see https://typescript-eslint.io/rules/only-throw-error
         */
        "@typescript-eslint/only-throw-error": [
          "error",
          {
            allow: [
              {
                from: "package",
                name: ["Redirect", "NotFoundError"],
                package: "@tanstack/router-core",
              },
            ],
          },
        ],
      },
    },

    {
      name: name("tanstack-router/sort-objects"),
      rules: {
        /**
         * route定義のプロパティ順は型推論に効くため、create-route-property-orderが
         * 決めた順を守る必要がある。baseのperfectionistがアルファベット順に直そうとして
         * 競合し、どちらもauto fixできるので互いを打ち消し合う。
         * route定義のオブジェクトだけ並べ替えの対象外にする。
         *
         * @see https://perfectionist.dev/rules/sort-objects#useconfigurationif
         */
        "perfectionist/sort-objects": [
          "error",
          {
            type: "unsorted",
            // 照合対象はcalleeのソース文字列。createFileRoute("/about")のように
            // 引数まで含むため、関数名の直後で切る。
            useConfigurationIf: {
              callingFunctionNamePattern: String.raw`^create(File|Root)?Route(WithContext)?\b`,
            },
          },
          // route定義以外はbaseと同じ挙動に戻す。rules/perfectionist.tsが読む
          // recommended-naturalの値と揃える。
          { order: "asc", type: "natural" },
        ],
      },
    },

    {
      /**
       * routesDirectoryの既定値。変更した場合はconsumer側で同じ設定を足す。
       *
       * @see https://tanstack.com/router/latest/docs/api/file-based-routing
       */
      files: ["**/src/routes/**"],
      name: name("tanstack-router/react-refresh"),
      rules: {
        /**
         * routeファイルは`export const Route`が必須でcomponentだけをexportする形にできない。
         * router-generatorが生成するrouteファイルもcomponentをexportしないため常に落ちる。
         *
         * @see https://github.com/ArnaudBarre/eslint-plugin-react-refresh
         */
        "react-refresh/only-export-components": "off",
      },
    },
  ]);
}
