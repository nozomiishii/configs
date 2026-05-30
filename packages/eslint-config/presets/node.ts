import { defineConfig } from "eslint/config";
import globals from "globals";
import { n } from "../rules/n";
import { name } from "../utils/name";
import { base } from "./base";

/**
 * CLI / library 向け。base + Node.js ランタイム層。
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
  ]);
}
