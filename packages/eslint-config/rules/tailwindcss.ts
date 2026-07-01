import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import { defineConfig } from "eslint/config";
import type { BetterTailwindcssOptions } from "../types";
import { name } from "../utils/name";

/**
 * @returns eslint-plugin-better-tailwindcss
 *
 * @see https://github.com/schoero/eslint-plugin-better-tailwindcss
 */
export function betterTailwindcss(options?: BetterTailwindcssOptions) {
  return defineConfig([
    {
      name: name("tailwindcss"),
      plugins: {
        "better-tailwindcss": eslintPluginBetterTailwindcss,
      },
      rules: {
        ...eslintPluginBetterTailwindcss.configs["recommended-warn"].rules,

        // Prettierと競合する
        "better-tailwindcss/enforce-consistent-line-wrapping": "off",
      },
      settings: {
        "better-tailwindcss": {
          ...(options?.cwd && { cwd: options.cwd }),
          entryPoint: options?.entryPoint ?? "src/global.css",
        },
      },
    },
  ]);
}
