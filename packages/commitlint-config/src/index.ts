import type { UserConfig } from "@commitlint/types";

/**
 * Configuration
 * {@link https://commitlint.js.org/#/reference-configuration}
 *
 * Rules
 * {@link https://commitlint.js.org/#/reference-rules}
 */
const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  plugins: [
    {
      rules: {
        "body-ascii-only": ({ body }) => {
          if (!body) return [true];
          const valid = [...body].every((c) => c.charCodeAt(0) < 0x80);
          return [valid, "body must contain ASCII characters only (write in English)"];
        },
      },
    },
  ],
  rules: {
    "type-enum": [2, "always", ["feat", "fix", "chore"]],
    "body-ascii-only": [2, "always"],
  },
};

export default config;
