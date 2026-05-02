import type { Linter } from "eslint";
// @ts-expect-error missing types 型がない
import eslintPluginJsxA11yX from "eslint-plugin-jsx-a11y-x";
import { defineConfig } from "eslint/config";
import { name } from "../utils/name";

const plugin = eslintPluginJsxA11yX as {
  flatConfigs: { recommended: Linter.Config };
};

/**
 * @returns eslint-plugin-jsx-a11y-x
 *
 * @see https://github.com/es-tooling/eslint-plugin-jsx-a11y-x
 */
export function jsxA11yX() {
  return defineConfig([
    {
      ...plugin.flatConfigs.recommended,
      name: name("jsx-a11y-x"),
    },
  ]);
}
