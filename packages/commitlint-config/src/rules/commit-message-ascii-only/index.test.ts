import lint from "@commitlint/lint";
import { describe, expect, it } from "vitest";

import { name, rule } from "./index.js";

// rule callback を直接呼び、parser を介さず純粋ロジックを単体検証する。
// `commit-message-ascii-only` の検査範囲が body / footer / notes 全体に拡張されたことを保証する。
describe("commit-message-ascii-only (unit)", () => {
  it("空の commit (body/footer/notes すべて空) は通過する", () => {
    const [valid] = rule({ body: null, footer: null, notes: [] });
    expect(valid).toBe(true);
  });

  it("body / footer / notes すべて ASCII なら通過する", () => {
    const [valid] = rule({
      body: "English body line.",
      footer: "Refs #123",
      notes: [{ title: "BREAKING CHANGE", text: "english breaking note" }],
    });
    expect(valid).toBe(true);
  });

  it("body に日本語が含まれる場合は失敗し、固定メッセージを返す", () => {
    const [valid, message] = rule({ body: "日本語の本文。", footer: null, notes: [] });
    expect(valid).toBe(false);
    expect(message).toMatch(/ASCII characters only/);
  });

  it("footer に日本語が含まれる場合は失敗する (PR #2145 で漏れたケース)", () => {
    // parser が body 1 行目の `#nnn` を検出して以降を footer に振り分けたときに、
    // body は空文字列となり footer 側に日本語が流れ込む状況を再現。
    const [valid] = rule({
      body: "",
      footer: "Issue #2126 のような本文。日本語混入。",
      notes: [],
    });
    expect(valid).toBe(false);
  });

  it("BREAKING CHANGE notes の text に日本語が含まれる場合は失敗する", () => {
    const [valid] = rule({
      body: "English body.",
      footer: null,
      notes: [{ title: "BREAKING CHANGE", text: "互換性破壊の説明" }],
    });
    expect(valid).toBe(false);
  });

  it("notes の title に日本語が含まれる場合は失敗する", () => {
    // ルール実装は title と text を両方検査対象に含めている契約。
    // 実用上 title はほぼ "BREAKING CHANGE" 固定だが、契約をテストで固定する。
    const [valid] = rule({
      body: "English body.",
      footer: null,
      notes: [{ title: "破壊的変更", text: "english" }],
    });
    expect(valid).toBe(false);
  });
});

// `@commitlint/lint` を介した end-to-end 検証。
// PR #2145 で問題になった「body 1 行目の `#nnn` で parser が footer に振り分ける」挙動を
// 実 parser で踏ませ、ルールが期待通り検出するかを確認する。
describe("commit-message-ascii-only (integration via @commitlint/lint)", () => {
  const rules = { [name]: [2, "always"] } as const;
  const opts = { plugins: { local: { rules: { [name]: rule } } } } as const;

  it("body 1 行目に `#issue-ref` + 日本語混在を検出する", async () => {
    const message = ["feat(scope): subject", "", "Issue #2126 のような本文。日本語混入。"].join(
      "\n",
    );

    const result = await lint(message, rules, opts);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.name === name)).toBe(true);
  });

  it("純英語コミットは通過する", async () => {
    const message = [
      "feat(scope): subject",
      "",
      "English body. Refs #2126.",
      "",
      "BREAKING CHANGE: english note",
    ].join("\n");

    const result = await lint(message, rules, opts);

    expect(result.valid).toBe(true);
  });
});
