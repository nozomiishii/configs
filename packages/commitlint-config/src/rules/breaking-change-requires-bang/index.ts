import type { RuleConfigTuple } from "@commitlint/types";

export const name = "breaking-change-requires-bang";

// rule が参照するフィールドだけの最小入力。commitlint の Commit 型は index signature を持ち
// `notes` 配列を含むリテラルを直接代入できないため、最小型で受けて cast を不要にする。
// Commit はこの型に代入可能なので plugin 登録時の Rule 型とも互換。
type Parsed = {
  header?: string | null;
  notes?: { title?: string; text?: string }[];
};

// 破壊的変更は header の `!` で宣言する。`BREAKING CHANGE:` footer 単独は禁止。
// GitHub の squash commit では footer が畳まれて見えず、想定外の major bump を招くため。
export const rule = ({ header, notes }: Parsed): readonly [boolean, string?] => {
  // header は commitlint 側で trim されないため、偶発的な先頭空白を除いて bang を判定する。
  const hasBang = /^\w+(?:\([^)]*\))?!:/.test((header ?? "").trimStart());
  const hasBreaking = (notes ?? []).some((n) => /^BREAKING[ -]CHANGE$/.test(n.title ?? ""));
  return [
    !hasBreaking || hasBang,
    "declare a breaking change with `!` in the header (e.g. `chore!: ...`); a BREAKING CHANGE footer alone is not allowed because GitHub collapses the footer in squash commits",
  ];
};

export const severity: RuleConfigTuple<void> = [2, "always"];
