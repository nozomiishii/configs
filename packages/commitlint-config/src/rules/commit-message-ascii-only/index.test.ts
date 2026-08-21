import lint from "@commitlint/lint";
import { describe, expect, test } from "vitest";
import { commitMessageAsciiOnly } from ".";

const { name, rule } = commitMessageAsciiOnly;

// 検査対象のフィールド。
const fields = [
  { build: (text: string) => ({ body: text }), name: "body" },
  { build: (text: string) => ({ footer: text }), name: "footer" },
  { build: (text: string) => ({ header: text }), name: "header" },
  { build: (text: string) => ({ notes: [{ text, title: "BREAKING CHANGE" }] }), name: "note text" },
  { build: (text: string) => ({ notes: [{ text: "english", title: text }] }), name: "note title" },
];

// 文字種。
const samples = [
  { name: "accented latin", text: "café latte", valid: false },
  { name: "ascii", text: "plain english text", valid: true },
  { name: "emoji", text: "ship it 🚀", valid: false },
  { name: "japanese", text: "日本語のテキスト", valid: false },
];

// フィールドと文字種の 2 軸。どのフィールドに入っても判定が変わらないことを固定する。
describe.each(fields)("commit-message-ascii-only ($name)", ({ build }) => {
  test.each(samples)("$name", ({ text, valid }) => {
    const [actual] = rule(build(text));

    expect(actual).toBe(valid);
  });
});

// 2 軸に乗らない、rule 単体の契約。
describe("commit-message-ascii-only (contract)", () => {
  // 空のコミットを許可する。
  test("allows a commit with no field at all", () => {
    const [valid] = rule({});

    expect(valid).toBe(true);
  });

  // 全フィールドが同時に埋まっていても、ASCII なら許可する。
  test("allows ASCII in every field at once", () => {
    const [valid] = rule({
      body: "English body line.",
      footer: "Refs #123",
      header: "feat: add something",
      notes: [{ text: "english breaking note", title: "BREAKING CHANGE" }],
    });

    expect(valid).toBe(true);
  });

  // 違反時のメッセージで、対象がコミットメッセージ全体だと分かるようにする。
  test("reports that the whole commit message must be ASCII", () => {
    const [, message] = rule({ header: "chore: 日本語のタイトル" });

    expect(message).toBe("commit message must contain ASCII characters only (write in English)");
  });
});

// 実 parser がどのフィールドへ振り分けても判定が効くことを確認する。文字種は上の 2 軸が持つ。
describe("commit-message-ascii-only (parser routing via @commitlint/lint)", () => {
  const rules = { [name]: [2, "always"] } as const;
  const opts = { plugins: { local: { rules: { [name]: rule } } } } as const;

  const routings = [
    { message: "chore: 日本語のタイトル", name: "the subject lands in the header", valid: false },
    {
      message: 'revert: "feat: add something"',
      name: "a quoted revert subject stays in the header",
      valid: true,
    },
    {
      message: ["feat: subject", "", "English body. Refs #2126."].join("\n"),
      name: "an English body stays in the body",
      valid: true,
    },
    {
      // 本文 1 行目の `#nnn` を parser が footer 開始と判定し、body が空文字列になる経路。
      message: ["feat: subject", "", "Issue #2126 のような本文。日本語混入。"].join("\n"),
      name: "text after an issue reference lands in the footer",
      valid: false,
    },
    {
      message: ["feat!: subject", "", "BREAKING CHANGE: 日本語のノート"].join("\n"),
      name: "a breaking change note lands in the notes",
      valid: false,
    },
  ];

  test.each(routings)("$name", async ({ message, valid }) => {
    const result = await lint(message, rules, opts);

    expect(result.errors.map((e) => e.name)).toStrictEqual(valid ? [] : [name]);
  });
});
