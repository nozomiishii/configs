import { defineConfig } from "eslint/config";
import globals from "globals";
import type { Options } from "../types";
import {
  _nextjs,
  betterTailwindcss,
  jsxA11yX,
  n,
  playwright,
  prettier,
  react,
  reactHooks,
  reactRefresh,
  storybook,
} from "../rules";
import { name } from "../utils/name";
import { base } from "./base";

/**
 * Next.js / web アプリ向け。base + Node.js 層 + ブラウザ層 + web rules。
 *
 * node() からは作らず base を元に組む。Next は server コードも持つため
 * Node.js 層(eslint-plugin-n)も含める。prettier は末尾で一度だけ付ける。
 */
export function nextjs(options: Options = {}) {
  return defineConfig([
    ...base(options),

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
    reactRefresh("next"),
    jsxA11yX(),

    _nextjs(),

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

    {
      /**
       * next-intl越しにnext/linkやnext/navigationを使う
       *
       * @see https://next-intl-docs.vercel.app/docs/workflows/linting#consistent-usage-of-navigation-apis
       */
      name: name("next-intl"),
      rules: {
        "no-restricted-imports": [
          "error",
          {
            message: "Please import from `libs/next-intl` instead.",
            name: "next/link",
          },
          {
            importNames: [
              "getPathname",
              "permanentRedirect",
              "redirect",
              "usePathname",
              "useRouter",
            ],
            message: "Please import from `libs/next-intl` instead.",
            name: "next/navigation",
          },

          {
            importNames: ["getLocale"],
            message: "Please import from `libs/next-intl` instead.",
            name: "next-intl/server",
          },
        ],
      },
    },

    betterTailwindcss(options.betterTailwindcss),

    storybook(),
    playwright(),

    prettier(),
  ]);
}
