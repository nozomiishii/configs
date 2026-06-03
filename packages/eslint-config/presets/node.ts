import { defineConfig } from "eslint/config";
import globals from "globals";
import type { Options } from "../types";
import { n, prettier } from "../rules";
import { name } from "../utils/name";
import { base } from "./base";

/**
 * CLI / library 向け。base + Node.js ランタイム層。
 * base を元に組み、prettier を末尾で一度だけ付ける。
 */
export function node(options: Options = {}) {
  return defineConfig([
    ...base(options),

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
