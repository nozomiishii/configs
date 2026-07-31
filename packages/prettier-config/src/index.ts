import type { Config } from "prettier";
import packagejsonPlugin from "prettier-plugin-packagejson";

/**
 * Prettier options
 * {@link https://prettier.io/docs/options}
 */
export default {
  overrides: [
    {
      // prettier の format を実行したくないものを指定
      files: [
        "pnpm-lock.yaml",
        "submodules/**",
        // Next.js が next dev のたびに自動生成上書きするため
        "next-env.d.ts",
        // TanStack Router が route 変更のたびに自動生成上書きするため
        "**/routeTree.gen.ts",
        // markdown は remark で行う
        "*.md",
        "*.mdx",
      ],
      options: {
        requirePragma: true,
      },
    },
    {
      // Claude Code が多行で書き戻す settings.json を prettier に整形させない。
      // json parser は requirePragma を無視するので、尊重する jsonc に切替える。
      files: ["**/.claude/settings.json"],
      options: {
        parser: "jsonc",
        requirePragma: true,
      },
    },
    {
      // JSONC / JSON5 は native parser に委ねコメント等の言語機能を保つ。
      // ただし VSCode の JSONC モードは trailing comma を allowed-but-discouraged 扱いで warning を出す
      // ({@link https://code.visualstudio.com/docs/languages/json}) ため、自動付与は止める
      files: ["*.json5", "*.jsonc"],
      options: {
        trailingComma: "none",
      },
    },
  ],

  // plugin object を直渡し。string 指定だと consumer 側で publicHoistPattern: '*prettier*' が必要になる。
  // {@link https://prettier.io/docs/plugins#using-plugins} import した plugin を渡す code example
  // {@link https://prettier.io/docs/api} `plugins: (string | URL | Plugin)[]` の型注釈
  plugins: [packagejsonPlugin],

  // 1 行あたりの文字数。default 80。型注釈言語コミュニティの収束点として 100 を採用 (Rust / Google Java / Apple swift-format / Linux kernel 2020 で 80 deprecate / OXC oxfmt 2025)。
  printWidth: 100,
} satisfies Config;
