import eslintPluginPerfectionist from "eslint-plugin-perfectionist";
import { defineConfig } from "eslint/config";
import globals from "globals";
import type { Options } from "../types";
import {
  betterTailwindcss,
  jsxA11yX,
  n,
  playwright,
  prettier,
  react,
  reactHooks,
  reactRefresh,
  storybook,
  tanstackRouter,
} from "../rules";
import { name } from "../utils/name";
import { base } from "./base";

/**
 * route定義のオブジェクトを受け取る関数。
 * create-route-property-orderが並び順を見る対象と同じ。
 *
 * @see https://github.com/TanStack/router/blob/main/packages/eslint-plugin-router/src/rules/create-route-property-order/constants.ts
 */
const routeDefinitionFunctions = [
  "createFileRoute",
  "createRootRoute",
  "createRootRouteWithContext",
  "createRoute",
];

/**
 * base の sort-objects 設定。上書きしても route 定義以外は元の挙動を保つため、
 * 値を書き写さず recommended-natural から取る。
 */
const sortObjectsRule =
  eslintPluginPerfectionist.configs["recommended-natural"].rules?.["perfectionist/sort-objects"];
const sortObjectsFallback = Array.isArray(sortObjectsRule) ? sortObjectsRule.slice(1) : [];

/**
 * TanStack Start / web アプリ向け。base + Node.js 層 + ブラウザ層 + web rules。
 *
 * node() からは作らず base を元に組む。SPA mode でも server function と
 * server route は使え、shell は SSR ビルドで prerender されるため
 * Node.js 層(eslint-plugin-n)も含める。prettier は末尾で一度だけ付ける。
 */
export function tanstackStart(options: Options = {}) {
  return defineConfig([
    ...base(options),

    {
      /**
       * generatedRouteTree の既定値。生成物なので lint 対象から外す。
       * ファイル自身が付けている eslint-disable は base の noInlineConfig で効かない。
       *
       * @see https://tanstack.com/router/latest/docs/api/file-based-routing
       */
      ignores: ["**/routeTree.gen.ts"],
      name: name("tanstack-start/generated"),
    },

    {
      languageOptions: {
        globals: globals.node,
      },
      name: name("languageOptions/globals/node"),
    },

    n(),

    {
      languageOptions: {
        globals: globals.browser,
      },
      name: name("languageOptions/globals/browser"),
    },

    react(),
    reactHooks(),
    reactRefresh("vite"),
    jsxA11yX(),

    tanstackRouter(),
    betterTailwindcss(options.betterTailwindcss),

    storybook(),
    playwright(),

    // ここから下は TanStack Router の書き方に合わせた他 plugin の調整。
    // 上書き対象より後に置く必要がある。
    {
      name: name("tanstack-start/only-throw-error"),
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
      name: name("tanstack-start/sort-objects"),
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
              callingFunctionNamePattern: routeDefinitionFunctions.map(
                (fn) => String.raw`^${fn}\b`,
              ),
            },
          },
          ...sortObjectsFallback,
        ],
      },
    },

    {
      // env.client.ts のように分割した場合も例外にする
      ignores: ["**/env.ts", "**/env.*.ts"],
      name: name("tanstack-start/import-meta-env"),
      rules: {
        /**
         * n/no-process-envと同じ運用。envの読み取りをenv.tsに集約して、
         * 値の欠落と型付けを1箇所で扱う。
         * import.meta.env向けの専用ruleが無いためselectorで書く。
         *
         * @see https://vite.dev/guide/env-and-mode
         */
        "no-restricted-syntax": [
          "error",
          {
            message: "Please read env through `env.ts` instead.",
            selector: 'MemberExpression[object.type="MetaProperty"][property.name="env"]',
          },
        ],
      },
    },

    {
      files: ["**/src/routes/**"],
      name: name("tanstack-start/filename-case"),
      rules: {
        /**
         * `-` prefixはroute treeから除外するファイルとディレクトリ、
         * 末尾`_`は親routeに入れ子にしない記法。
         * どちらもkebab-caseに直すとルーティングが変わる。
         *
         * @see https://github.com/TanStack/router/blob/main/docs/router/routing/file-naming-conventions.md
         */
        "unicorn/filename-case": ["error", { ignore: [/^-/u, /_\./u] }],
      },
    },

    {
      /**
       * routesDirectoryの既定値。変更した場合はconsumer側で同じ設定を足す。
       *
       * @see https://tanstack.com/router/latest/docs/api/file-based-routing
       */
      files: ["**/src/routes/**"],
      name: name("tanstack-start/react-refresh"),
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

    prettier(),
  ]);
}
