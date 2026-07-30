import lint from "@commitlint/lint";
import { describe, expect, test } from "vitest";
import { breakingChangeRequiresBang } from ".";

const { name, rule } = breakingChangeRequiresBang;

// breaking change を宣言するなら header に `!` が必須。footer だけの `BREAKING CHANGE:` は禁止。
// GitHub の squash commit では footer が畳まれて見えず、prefix と実態がズレるため。
// type は問わない（`chore!` も可）。組み込みの breaking-change-exclamation-mark (XNOR) とは違い、
// `!` 単独は許可・footer 単独だけを弾く一方向の含意。

describe("breaking-change-requires-bang (unit)", () => {
  // breaking marker のない通常コミットを許可する。
  test("allows a regular commit without a breaking marker", () => {
    const [valid] = rule({ header: "feat: add foo", notes: [] });

    expect(valid).toBe(true);
  });

  // header に bang がある場合は breaking note を許可する。
  test("allows a breaking note when the header contains a bang", () => {
    const [valid] = rule({
      header: "feat!: drop node 18",
      notes: [{ text: "drop node 18", title: "BREAKING CHANGE" }],
    });

    expect(valid).toBe(true);
  });

  // header に bang がない breaking footer を拒否する。
  test("rejects a breaking footer without a header bang", () => {
    const [valid] = rule({
      header: "feat: add foo",
      notes: [{ text: "removed old api", title: "BREAKING CHANGE" }],
    });

    expect(valid).toBe(false);
  });

  // ハイフン形式の breaking-change note を検出する。
  test("detects a hyphenated breaking-change note", () => {
    const [valid] = rule({
      header: "fix: patch",
      notes: [{ text: "changed signature", title: "BREAKING-CHANGE" }],
    });

    expect(valid).toBe(false);
  });

  // 先頭に空白があっても header の bang を許可する。
  test("allows a header bang after leading whitespace", () => {
    // commitlint は header を trim せず rule に渡す。consumer が header-trim を無効化しても
    // 偶発的な先頭空白で bang を見落とさないことを保証する。
    const [valid] = rule({
      header: "  feat!: x",
      notes: [{ text: "x", title: "BREAKING CHANGE" }],
    });

    expect(valid).toBe(true);
  });
});

describe("breaking-change-requires-bang (integration via @commitlint/lint)", () => {
  const rules = { [name]: [2, "always"] } as const;
  const opts = { plugins: { local: { rules: { [name]: rule } } } };

  // header に bang がない breaking change footer を拒否する。
  test("rejects a breaking change footer without a header bang", async () => {
    const message = ["feat: add foo", "", "BREAKING CHANGE: removed old api"].join("\n");
    const result = await lint(message, rules, opts);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.name === name)).toBe(true);
  });
});
