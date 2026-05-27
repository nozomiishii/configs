import type { RuleConfigTuple } from "@commitlint/types";
import type { CommitBase } from "conventional-commits-parser";

export const name = "breaking-change-requires-bang";

type Parsed = Partial<Pick<CommitBase, "header" | "notes">>;

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
