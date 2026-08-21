import lint from "@commitlint/lint";
import { describe, expect, test } from "vitest";
import { commitMessageAsciiOnly } from ".";

const { name, rule } = commitMessageAsciiOnly;

const rules = { [name]: [2, "always"] } as const;
const opts = { plugins: { local: { rules: { [name]: rule } } } } as const;

// 検査対象のフィールド。
const fields = [
  { build: (text: string) => ({ body: text }), name: "body" },
  { build: (text: string) => ({ footer: text }), name: "footer" },
  { build: (text: string) => ({ header: text }), name: "header" },
  { build: (text: string) => ({ notes: [{ text, title: "BREAKING CHANGE" }] }), name: "note text" },
  { build: (text: string) => ({ notes: [{ text: "english", title: text }] }), name: "note title" },
];

// 弾かれる文字種。
const nonAsciiSamples = [
  { name: "accented latin", text: "café latte" },
  { name: "emoji", text: "ship it 🚀" },
  { name: "japanese", text: "日本語のテキスト" },
];

describe("commit-message-ascii-only (allows ASCII)", () => {
  // ASCII はどのフィールドに入っても通る。
  test.each(fields)("$name", ({ build }) => {
    const [valid] = rule(build("plain english text"));

    expect(valid).toBe(true);
  });

  // フィールドが 1 つも無いコミットを通す。
  test("no field at all", () => {
    const [valid] = rule({});

    expect(valid).toBe(true);
  });

  // 全フィールドが同時に埋まっていても通す。
  test("every field at once", () => {
    const [valid] = rule({
      body: "English body line.",
      footer: "Refs #123",
      header: "feat: add something",
      notes: [{ text: "english breaking note", title: "BREAKING CHANGE" }],
    });

    expect(valid).toBe(true);
  });
});

describe("commit-message-ascii-only (rejects non-ASCII)", () => {
  // 非 ASCII はどのフィールドに入っても弾かれる。
  describe.each(fields)("$name", ({ build }) => {
    test.each(nonAsciiSamples)("$name", ({ text }) => {
      const [valid] = rule(build(text));

      expect(valid).toBe(false);
    });
  });

  // 対象がコミットメッセージ全体だと分かるメッセージを返す。
  test("reports that the whole commit message must be ASCII", () => {
    const [, message] = rule({ header: "chore: 日本語のタイトル" });

    expect(message).toBe("commit message must contain ASCII characters only (write in English)");
  });
});

describe("commit-message-ascii-only (parser routing, allows ASCII)", () => {
  // 実 parser がどのフィールドへ振り分けても、ASCII なら通る。
  test.each([
    {
      message: 'revert: "feat: add something"',
      name: "a quoted revert subject stays in the header",
    },
    {
      message: ["feat: subject", "", "English body. Refs #2126."].join("\n"),
      name: "an English body stays in the body",
    },
  ])("$name", async ({ message }) => {
    const result = await lint(message, rules, opts);

    expect(result.errors.map((e) => e.name)).toStrictEqual([]);
  });
});

describe("commit-message-ascii-only (parser routing, rejects non-ASCII)", () => {
  // 実 parser がどのフィールドへ振り分けても、非 ASCII は弾かれる。
  test.each([
    { message: "chore: 日本語のタイトル", name: "the subject lands in the header" },
    {
      // 本文 1 行目の `#nnn` を parser が footer 開始と判定し、body が空文字列になる経路。
      message: ["feat: subject", "", "Issue #2126 のような本文。日本語混入。"].join("\n"),
      name: "text after an issue reference lands in the footer",
    },
    {
      message: ["feat!: subject", "", "BREAKING CHANGE: 日本語のノート"].join("\n"),
      name: "a breaking change note lands in the notes",
    },
  ])("$name", async ({ message }) => {
    const result = await lint(message, rules, opts);

    expect(result.errors.map((e) => e.name)).toStrictEqual([name]);
  });
});
