import eslintPluginReact from "@eslint-react/eslint-plugin";
import { defineConfig } from "eslint/config";
import { name } from "../utils/name";

/**
 * @returns `@eslint-react/eslint-plugin`
 *
 * @see https://github.com/Rel1cx/eslint-react
 */
export function react() {
  return defineConfig([
    {
      // https://github.com/Rel1cx/eslint-react/blob/main/packages/plugins/eslint-plugin/src/configs/recommended-type-checked.ts
      ...eslintPluginReact.configs["recommended-type-checked"],
      files: ["**/*.{ts,cts,mts,tsx}"],
      name: name("react/recommended-type-checked"),
    },

    /**
     * .js系はtypescript/disable-type-checked-jsでprojectServiceを切っているため、
     * 型を見るruleを含まないrecommendedを当てる。
     *
     * @see https://github.com/Rel1cx/eslint-react/blob/main/packages/plugins/eslint-plugin/src/configs/recommended.ts
     * @see https://typescript-eslint.io/troubleshooting/typed-linting/#how-do-i-disable-type-checked-linting-for-a-file
     */
    {
      ...eslintPluginReact.configs.recommended,
      files: ["**/*.{js,cjs,mjs,jsx}"],
      name: name("react/recommended-js"),
    },
  ]);
}
