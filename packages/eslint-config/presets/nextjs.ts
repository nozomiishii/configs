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
    reactRefresh(),
    jsxA11yX(),

    _nextjs(),
    betterTailwindcss(options.betterTailwindcss),

    storybook(),
    playwright(),

    prettier(),
  ]);
}
