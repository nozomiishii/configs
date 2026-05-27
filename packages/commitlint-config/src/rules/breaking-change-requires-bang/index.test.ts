import lint from "@commitlint/lint";
import { describe, expect, it } from "vitest";

import { breakingChangeRequiresBang } from "./index.js";

const { name, rule } = breakingChangeRequiresBang;

// breaking change を宣言するなら header に `!` が必須。footer だけの `BREAKING CHANGE:` は禁止。
// GitHub の squash commit では footer が畳まれて見えず、prefix と実態がズレるため。
// type は問わない（`chore!` も可）。組み込みの breaking-change-exclamation-mark (XNOR) とは違い、
// `!` 単独は許可・footer 単独だけを弾く一方向の含意。

describe("breaking-change-requires-bang (unit)", () => {
  it("breaking marker なしの通常コミットは通過する", () => {
    const [valid] = rule({ header: "feat: add foo", notes: [] });
    expect(valid).toBe(true);
  });

  it("header に `!` があり breaking note もある (feat!) は通過する", () => {
    const [valid] = rule({
      header: "feat!: drop node 18",
      notes: [{ title: "BREAKING CHANGE", text: "drop node 18" }],
    });
    expect(valid).toBe(true);
  });

  it("header に `!` なしで footer だけ breaking は失敗する", () => {
    const [valid] = rule({
      header: "feat: add foo",
      notes: [{ title: "BREAKING CHANGE", text: "removed old api" }],
    });
    expect(valid).toBe(false);
  });

  it("BREAKING-CHANGE (ハイフン) note も検出する", () => {
    const [valid] = rule({
      header: "fix: patch",
      notes: [{ title: "BREAKING-CHANGE", text: "changed signature" }],
    });
    expect(valid).toBe(false);
  });

  it("header 先頭に空白があっても `!` を検出して通過する", () => {
    // commitlint は header を trim せず rule に渡す。consumer が header-trim を無効化しても
    // 偶発的な先頭空白で bang を見落とさないことを保証する。
    const [valid] = rule({
      header: "  feat!: x",
      notes: [{ title: "BREAKING CHANGE", text: "x" }],
    });
    expect(valid).toBe(true);
  });
});

describe("breaking-change-requires-bang (integration via @commitlint/lint)", () => {
  const rules = { [name]: [2, "always"] } as const;
  const opts = { plugins: { local: { rules: { [name]: rule } } } };

  it("`!` なしで BREAKING CHANGE footer だけのコミットを弾く", async () => {
    const message = ["feat: add foo", "", "BREAKING CHANGE: removed old api"].join("\n");
    const result = await lint(message, rules, opts);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.name === name)).toBe(true);
  });
});
