import type { OxfmtConfig } from "oxfmt";

/**
 * Oxfmt options
 * @see https://oxc.rs/docs/guide/usage/formatter/config-file-reference
 */
export default {
  ignorePatterns: [
    // TanStack Router が route 変更のたびに自動生成上書きするため
    "**/routeTree.gen.ts",
    // markdown は remark で行う
    "*.md",
    "*.mdx",
    // Claude Code がフォーマットを上書きするため
    "**/.claude/settings.json",
  ],

  sortPackageJson: {
    sortScripts: true,
  },
} satisfies OxfmtConfig;
