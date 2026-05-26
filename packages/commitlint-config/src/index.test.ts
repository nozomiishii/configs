import lint from "@commitlint/lint";
import { describe, expect, it } from "vitest";

import config from "./index.js";

describe("scope-empty (default deny scope)", () => {
  it("default config に scope-empty: [2, 'always'] が登録されている", () => {
    expect(config.rules?.["scope-empty"]).toEqual([2, "always"]);
  });

  it("scope なしのコミットは pass する", async () => {
    const result = await lint("feat: add foo", { "scope-empty": [2, "always"] } as const);
    expect(result.valid).toBe(true);
  });

  it("scope 付きのコミットは fail する", async () => {
    const result = await lint("feat(api): add foo", { "scope-empty": [2, "always"] } as const);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.name === "scope-empty")).toBe(true);
  });

  it("consumer が scope-empty を 0 に上書きすれば scope 付きでも pass する", async () => {
    const result = await lint("feat(api): add foo", { "scope-empty": [0, "always"] } as const);
    expect(result.valid).toBe(true);
  });
});

// breaking change を宣言するなら header に `!` が必須。footer だけの `BREAKING CHANGE:` は禁止。
// GitHub の squash commit では footer が畳まれて見えず、prefix と実態がズレるため。
// type は問わない（`chore!` も可）。組み込みの breaking-change-exclamation-mark (XNOR) とは違い、
// `!` 単独は許可・footer 単独だけを弾く一方向の含意。
const breakingPlugin = config.plugins?.[0];
if (!breakingPlugin || typeof breakingPlugin === "string") {
  throw new Error("commitlint plugin not configured");
}
const breakingRuleCallback = breakingPlugin.rules?.["breaking-change-requires-bang"];
if (typeof breakingRuleCallback !== "function") {
  throw new Error("breaking-change-requires-bang rule callback not found in plugin");
}

// rule が参照する header / notes だけを持つ最小入力。parser の Commit 型は index signature が
// 全プロパティを string 扱いにするため synthetic な notes 配列と衝突する。テスト入力用に絞る。
type BreakingInput = { header?: string | null; notes?: { title?: string; text?: string }[] };
const runBreakingRule = (parsed: BreakingInput) =>
  breakingRuleCallback(
    parsed as unknown as Parameters<typeof breakingRuleCallback>[0],
  ) as readonly [boolean, string?];

describe("breaking-change-requires-bang (unit)", () => {
  it("default config に breaking-change-requires-bang: [2, 'always'] が登録されている", () => {
    expect(config.rules?.["breaking-change-requires-bang"]).toEqual([2, "always"]);
  });

  it("breaking marker なしの通常コミットは通過する", () => {
    const [valid] = runBreakingRule({ header: "feat: add foo", notes: [] });
    expect(valid).toBe(true);
  });

  it("header に `!` があり breaking note もある (feat!) は通過する", () => {
    const [valid] = runBreakingRule({
      header: "feat!: drop node 18",
      notes: [{ title: "BREAKING CHANGE", text: "drop node 18" }],
    });
    expect(valid).toBe(true);
  });

  it("header に `!` なしで footer だけ breaking は失敗する", () => {
    const [valid] = runBreakingRule({
      header: "feat: add foo",
      notes: [{ title: "BREAKING CHANGE", text: "removed old api" }],
    });
    expect(valid).toBe(false);
  });

  it("BREAKING-CHANGE (ハイフン) note も検出する", () => {
    const [valid] = runBreakingRule({
      header: "fix: patch",
      notes: [{ title: "BREAKING-CHANGE", text: "changed signature" }],
    });
    expect(valid).toBe(false);
  });

  it("header 先頭に空白があっても `!` を検出して通過する", () => {
    // commitlint は header を trim せず rule に渡す。consumer が header-trim を無効化しても
    // 偶発的な先頭空白で bang を見落とさないことを保証する。
    const [valid] = runBreakingRule({
      header: "  feat!: x",
      notes: [{ title: "BREAKING CHANGE", text: "x" }],
    });
    expect(valid).toBe(true);
  });
});

describe("breaking-change-requires-bang (integration via @commitlint/lint)", () => {
  const rules = { "breaking-change-requires-bang": [2, "always"] } as const;
  // 本番は config-conventional の conventionalcommits preset で動く。@commitlint/lint の
  // 既定 parser は `BREAKING-CHANGE` (ハイフン) を note 化しないため、note 検出を本番と
  // 揃えるよう noteKeywords を明示する。
  const opts = {
    plugins: { local: breakingPlugin },
    parserOpts: { noteKeywords: ["BREAKING CHANGE", "BREAKING-CHANGE"] },
  };

  it("`!` なしで BREAKING CHANGE footer だけのコミットを弾く", async () => {
    const message = ["feat: add foo", "", "BREAKING CHANGE: removed old api"].join("\n");
    const result = await lint(message, rules, opts);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.name === "breaking-change-requires-bang")).toBe(true);
  });

  it("`BREAKING-CHANGE` (ハイフン) footer だけのコミットも弾く", async () => {
    const message = ["feat: add foo", "", "BREAKING-CHANGE: removed old api"].join("\n");
    const result = await lint(message, rules, opts);
    expect(result.valid).toBe(false);
  });
});
