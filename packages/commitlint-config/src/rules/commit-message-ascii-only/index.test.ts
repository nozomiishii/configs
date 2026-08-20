import lint from "@commitlint/lint";
import { describe, expect, test } from "vitest";
import { commitMessageAsciiOnly } from ".";

const { name, rule } = commitMessageAsciiOnly;

// rule callback を直接呼び、parser を介さず純粋ロジックを単体検証する。
// `commit-message-ascii-only` の検査範囲が header / body / footer / notes 全体に及ぶことを保証する。
describe("commit-message-ascii-only (unit)", () => {
  // header、body、footer、notes が空のコミットを許可する。
  test("allows an empty header, body, footer, and notes", () => {
    const [valid] = rule({ body: null, footer: null, header: null, notes: [] });

    expect(valid).toBe(true);
  });

  // header、body、footer、notes がすべて ASCII のコミットを許可する。
  test("allows an ASCII header, body, footer, and notes", () => {
    const [valid] = rule({
      body: "English body line.",
      footer: "Refs #123",
      header: "feat: add something",
      notes: [{ text: "english breaking note", title: "BREAKING CHANGE" }],
    });

    expect(valid).toBe(true);
  });

  // non-ASCII の body を固定メッセージ付きで拒否する。
  test("rejects a non-ASCII body with the fixed message", () => {
    const [valid, message] = rule({ body: "日本語の本文。", footer: null, notes: [] });

    expect(valid).toBe(false);
    expect(message).toMatch(/ASCII characters only/);
  });

  // non-ASCII の footer を拒否する。
  test("rejects a non-ASCII footer", () => {
    // parser が body 1 行目の `#nnn` を検出して以降を footer に振り分けたときに、
    // body は空文字列となり footer 側に日本語が流れ込む状況を再現。
    const [valid] = rule({
      body: "",
      footer: "Issue #2126 のような本文。日本語混入。",
      notes: [],
    });

    expect(valid).toBe(false);
  });

  // breaking change note 内の non-ASCII text を拒否する。
  test("rejects non-ASCII text in breaking change notes", () => {
    const [valid] = rule({
      body: "English body.",
      footer: null,
      notes: [{ text: "互換性破壊の説明", title: "BREAKING CHANGE" }],
    });

    expect(valid).toBe(false);
  });

  // non-ASCII の note title を拒否する。
  test("rejects a non-ASCII note title", () => {
    // ルール実装は title と text を両方検査対象に含めている契約。
    // 実用上 title はほぼ "BREAKING CHANGE" 固定だが、契約をテストで固定する。
    const [valid] = rule({
      body: "English body.",
      footer: null,
      notes: [{ text: "english", title: "破壊的変更" }],
    });

    expect(valid).toBe(false);
  });

  // non-ASCII の header を固定メッセージ付きで拒否する。
  test("rejects a non-ASCII header with the fixed message", () => {
    const [valid, message] = rule({ body: null, footer: null, header: "chore: 日本語のタイトル" });

    expect(valid).toBe(false);
    expect(message).toMatch(/ASCII characters only/);
  });

  // header 内の emoji を拒否する。
  test("rejects an emoji in the header", () => {
    // emoji は surrogate pair のため、byte 長と code unit 長の比較で検出できることを固定する。
    const [valid] = rule({ body: null, footer: null, header: "chore: emoji 🚀" });

    expect(valid).toBe(false);
  });

  // header 内の accented latin を拒否する。
  test("rejects accented latin characters in the header", () => {
    const [valid] = rule({ body: null, footer: null, header: "chore: café latte" });

    expect(valid).toBe(false);
  });

  // scope 内の non-ASCII を拒否する。
  test("rejects a non-ASCII scope", () => {
    // scope を許可した consumer でも header 全体が検査対象であることを固定する。
    const [valid] = rule({ body: null, footer: null, header: "feat(日本語): subject" });

    expect(valid).toBe(false);
  });
});

// `@commitlint/lint` を介した end-to-end 検証。
// PR #2145 で問題になった「body 1 行目の `#nnn` で parser が footer に振り分ける」挙動を
// 実 parser で踏ませ、ルールが期待通り検出するかを確認する。
describe("commit-message-ascii-only (integration via @commitlint/lint)", () => {
  const rules = { [name]: [2, "always"] } as const;
  const opts = { plugins: { local: { rules: { [name]: rule } } } } as const;

  // issue 参照より後ろにある non-ASCII text を検出する。
  test("detects non-ASCII text after an issue reference", async () => {
    const message = ["feat(scope): subject", "", "Issue #2126 のような本文。日本語混入。"].join(
      "\n",
    );

    const result = await lint(message, rules, opts);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.name === name)).toBe(true);
  });

  // 英語だけのコミットを許可する。
  test("allows an English-only commit", async () => {
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

  // 日本語 subject のみのコミットを拒否する。
  test("rejects a Japanese subject", async () => {
    const result = await lint("chore: 日本語のタイトル", rules, opts);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.name === name)).toBe(true);
  });

  // emoji を含む subject のみのコミットを拒否する。
  test("rejects a subject containing an emoji", async () => {
    const result = await lint("chore: emoji 🚀", rules, opts);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.name === name)).toBe(true);
  });

  // accented latin を含む subject のみのコミットを拒否する。
  test("rejects a subject containing accented latin characters", async () => {
    const result = await lint("chore: café latte", rules, opts);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.name === name)).toBe(true);
  });

  // ASCII のみの subject を許可する。
  test("allows an ASCII-only subject", async () => {
    const result = await lint("chore: ok subject", rules, opts);

    expect(result.valid).toBe(true);
  });

  // revert コミットの引用付き subject を許可する。
  test("allows a revert subject wrapped in double quotes", async () => {
    const result = await lint('revert: "feat: add something"', rules, opts);

    expect(result.valid).toBe(true);
  });
});
