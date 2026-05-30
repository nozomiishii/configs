import { defineConfig } from "eslint/config";
import globals from "globals";
import { n } from "../rules/n";
import { prettier } from "../rules/prettier";
import { name } from "../utils/name";
import { base } from "./base";

/**
 * CLI / library 向け。base + Node.js ランタイム層。
 * base を元に組み、prettier を末尾で一度だけ付ける。
 */
export function node() {
  return defineConfig([
    ...base(),

    {
      languageOptions: {
        globals: globals.node,
      },
      name: name("languageOptions/globals/node"),
    },

    n(),

    prettier(),
  ]);
}
