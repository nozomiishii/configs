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
 * TanStack Start / web アプリ向け。base + Node.js 層 + ブラウザ層 + web rules。
 *
 * node() からは作らず base を元に組む。SPA mode でも server function と
 * server route は使え、shell は SSR ビルドで prerender されるため
 * Node.js 層(eslint-plugin-n)も含める。prettier は末尾で一度だけ付ける。
 *
 * tanstackRouter() は react-refresh の rule を route ファイルで off にするため、
 * reactRefresh() より後に置く。
 *
 * @see https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode
 */
export function tanstackStart(options: Options = {}) {
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
    reactRefresh("vite"),
    jsxA11yX(),

    tanstackRouter(),
    betterTailwindcss(options.betterTailwindcss),

    storybook(),
    playwright(),

    prettier(),
  ]);
}
