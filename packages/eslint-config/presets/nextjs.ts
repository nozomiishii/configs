import { defineConfig } from "eslint/config";
import globals from "globals";
import { jsxA11yX } from "../rules/jsx-a11y-x";
import { n } from "../rules/n";
import { _nextjs } from "../rules/nextjs";
import { playwright } from "../rules/playwright";
import { prettier } from "../rules/prettier";
import { react } from "../rules/react";
import { reactHooks } from "../rules/react-hooks";
import { reactRefresh } from "../rules/react-refresh";
import { storybook } from "../rules/storybook";
import { betterTailwindcss } from "../rules/tailwindcss";
import { name } from "../utils/name";
import { base } from "./base";

/**
 * Next.js / web アプリ向け。base + Node.js 層 + ブラウザ層 + web rules。
 *
 * node() からは作らず base を元に組む。Next は server コードも持つため
 * Node.js 層(eslint-plugin-n)も含める。prettier は末尾で一度だけ付ける。
 */
export function nextjs() {
  return defineConfig([
    ...base(),

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
    betterTailwindcss(),

    storybook(),
    playwright(),

    prettier(),
  ]);
}
