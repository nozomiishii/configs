import { defineConfig } from "eslint/config";
import globals from "globals";
import { jsxA11yX } from "../rules/jsx-a11y-x";
import { _nextjs } from "../rules/nextjs";
import { playwright } from "../rules/playwright";
import { prettier } from "../rules/prettier";
import { react } from "../rules/react";
import { reactHooks } from "../rules/react-hooks";
import { reactRefresh } from "../rules/react-refresh";
import { storybook } from "../rules/storybook";
import { betterTailwindcss } from "../rules/tailwindcss";
import { name } from "../utils/name";
import { node } from "./node";

/**
 * Next.js / web アプリ向け。node + ブラウザ層 + web rules。
 * prettierはstylistic/react系を打ち消すため末尾に再付与する。
 */
export function nextjs() {
  return defineConfig([
    ...node(),

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
