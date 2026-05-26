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
        // Header 以外 (body + footer + BREAKING CHANGE notes) を ASCII のみに制限する。
        // body のみを検査すると、本文 1 行目に `#issue-number` が含まれる場合に
        // conventional-commits-parser がその行から footer 開始と判定し、
        // body が空文字列となって ASCII チェックが素通りする問題があるため、
        // footer / notes も検査対象に含める。
        "commit-message-ascii-only": ({ body, footer, notes }) => {
          const noteText = (notes ?? []).flatMap((n) => [n.title, n.text]).join("\n");
          const text = [body, footer, noteText].filter(Boolean).join("\n");
          if (!text) return [true];
          const valid = [...text].every((c) => c.charCodeAt(0) < 0x80);
          return [
            valid,
            "commit message body / footer / notes must contain ASCII characters only (write in English)",
          ];
        },
        // 破壊的変更は header の `!` で宣言する。`BREAKING CHANGE:` footer 単独は禁止。
        // GitHub の squash commit では footer が畳まれて見えず、想定外の major bump を招くため。
        "breaking-change-requires-bang": ({ header, notes }) => {
          // header は commitlint 側で trim されないため、偶発的な先頭空白を除いて bang を判定する。
          const hasBang = /^\w+(?:\([^)]*\))?!:/.test((header ?? "").trimStart());
          const hasBreaking = (notes ?? []).some((n) => /^BREAKING[ -]CHANGE$/.test(n.title ?? ""));
          return [
            !hasBreaking || hasBang,
            "declare a breaking change with `!` in the header (e.g. `chore!: ...`); a BREAKING CHANGE footer alone is not allowed because GitHub collapses the footer in squash commits",
          ];
        },
      },
    },
  ],
  rules: {
    "type-enum": [2, "always", ["feat", "fix", "chore"]],
    "scope-empty": [2, "always"],
    "commit-message-ascii-only": [2, "always"],
    "breaking-change-requires-bang": [2, "always"],
  },
};

export default config;
