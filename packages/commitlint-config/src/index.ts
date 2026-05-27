import type { Plugin, RulesConfig, UserConfig } from "@commitlint/types";

import { breakingChangeRequiresBang } from "./rules/breaking-change-requires-bang";
import { commitMessageAsciiOnly } from "./rules/commit-message-ascii-only";

// custom rule を 1 ディレクトリ 1 module にまとめ、ここで集約する。
// rule 追加時はこの配列に push するだけで plugin callback と severity の両方が登録される。
const customRules = [commitMessageAsciiOnly, breakingChangeRequiresBang];

const pluginRules: Plugin["rules"] = Object.fromEntries(customRules.map((r) => [r.name, r.rule]));
const customSeverities: Partial<RulesConfig> = Object.fromEntries(
  customRules.map((r) => [r.name, r.severity]),
);

/**
 * Configuration
 * {@link https://commitlint.js.org/#/reference-configuration}
 *
 * Rules
 * {@link https://commitlint.js.org/#/reference-rules}
 */
const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  plugins: [{ rules: pluginRules }],
  rules: {
    "type-enum": [2, "always", ["feat", "fix", "chore"]],
    "scope-empty": [2, "always"],
    ...customSeverities,
  },
};

export default config;
