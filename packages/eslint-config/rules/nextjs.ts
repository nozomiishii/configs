import eslintPluginNext from "@next/eslint-plugin-next";
import { defineConfig } from "eslint/config";
import { name } from "../utils/name";

/**
 * @returns `@next/eslint-plugin-next`
 *
 * coreWebVitalsRulesは`@next/next/no-html-link-for-pages`と
 * `@next/next/no-sync-scripts`のルールがwarnからerrorになっただけ
 *
 * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/src/index.ts
 * @see https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next
 * @see https://nextjs.org/docs/app/api-reference/config/eslint#eslint-plugin
 */
export function _nextjs() {
  return defineConfig([
    {
      ...eslintPluginNext.configs.recommended,
      name: name("nextjs"),
    },
  ]);
}
