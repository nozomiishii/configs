import type { RuleConfigTuple } from "@commitlint/types";

export const name = "commit-message-ascii-only";

// rule が参照するフィールドだけの最小入力。commitlint の Commit 型は
// `CommitBase & Record<string, string | null>` の交差で index signature を持ち、
// `notes` 配列を含むオブジェクトリテラルを直接代入できない（テストで cast を強いられる）。
// Commit はこの最小型に代入可能なので、plugin 登録時の Rule 型とも互換になる。
type Parsed = {
  body?: string | null;
  footer?: string | null;
  notes?: { title?: string; text?: string }[];
};

// Header 以外 (body + footer + BREAKING CHANGE notes) を ASCII のみに制限する。
// body のみを検査すると、本文 1 行目に `#issue-number` が含まれる場合に
// conventional-commits-parser がその行から footer 開始と判定し、
// body が空文字列となって ASCII チェックが素通りする問題があるため、
// footer / notes も検査対象に含める。
export const rule = ({ body, footer, notes }: Parsed): readonly [boolean, string?] => {
  const noteText = (notes ?? []).flatMap((n) => [n.title, n.text]).join("\n");
  const text = [body, footer, noteText].filter(Boolean).join("\n");
  if (!text) return [true];
  const valid = [...text].every((c) => c.charCodeAt(0) < 0x80);
  return [
    valid,
    "commit message body / footer / notes must contain ASCII characters only (write in English)",
  ];
};

export const severity: RuleConfigTuple<void> = [2, "always"];
