import lint from "@commitlint/lint";
import { describe, expect, test } from "vitest";
import { commitMessageAsciiOnly } from ".";

const { name, rule } = commitMessageAsciiOnly;

// rule callback を直接呼び、parser を介さず検査対象フィールドを網羅する。
// 非 ASCII のサンプルは日本語で揃え、ケース間で変わるのはフィールドだけにする。
describe("commit-message-ascii-only (unit)", () => {
  test.each([
    { label: "no field is present", parsed: {}, valid: true },
    {
      label: "every field is ASCII",
      parsed: {
        body: "English body line.",
        footer: "Refs #123",
        header: "feat: add something",
        notes: [{ text: "english breaking note", title: "BREAKING CHANGE" }],
      },
      valid: true,
    },
    {
      label: "the header subject is Japanese",
      parsed: { header: "chore: 日本語のタイトル" },
      valid: false,
    },
    // scope を許可した consumer でも header 全体が検査対象になる。
    {
      label: "the header scope is Japanese",
      parsed: { header: "feat(日本語): subject" },
      valid: false,
    },
    { label: "the body is Japanese", parsed: { body: "日本語の本文。" }, valid: false },
    // parser が body 1 行目の `#nnn` 以降を footer へ振り分けると、日本語は footer 側に流れる。
    {
      label: "the footer is Japanese",
      parsed: { footer: "Issue #2126 のような本文。" },
      valid: false,
    },
    {
      label: "a note text is Japanese",
      parsed: { notes: [{ text: "互換性破壊の説明", title: "BREAKING CHANGE" }] },
      valid: false,
    },
    // title は実用上 "BREAKING CHANGE" 固定だが、検査対象に含める契約を固定する。
    {
      label: "a note title is Japanese",
      parsed: { notes: [{ text: "english", title: "破壊的変更" }] },
      valid: false,
    },
  ])("returns $valid when $label", ({ parsed, valid }) => {
    const [actual] = rule(parsed);

    expect(actual).toBe(valid);
  });

  // 違反時のメッセージで、対象がコミットメッセージ全体だと分かるようにする。
  test("reports that the whole commit message must be ASCII", () => {
    const [, message] = rule({ header: "chore: 日本語のタイトル" });

    expect(message).toBe("commit message must contain ASCII characters only (write in English)");
  });
});

// 実 parser を通した end-to-end 検証。文字種ごとの合否と、parser のフィールド振り分けを確認する。
describe("commit-message-ascii-only (integration via @commitlint/lint)", () => {
  const rules = { [name]: [2, "always"] } as const;
  const opts = { plugins: { local: { rules: { [name]: rule } } } } as const;

  test.each([
    { label: "an ASCII subject", message: "chore: ok subject", valid: true },
    {
      label: "a revert subject wrapped in double quotes",
      message: 'revert: "feat: add something"',
      valid: true,
    },
    {
      label: "an English body carrying an issue reference and a breaking note",
      message: [
        "feat(scope): subject",
        "",
        "English body. Refs #2126.",
        "",
        "BREAKING CHANGE: english note",
      ].join("\n"),
      valid: true,
    },
    { label: "a Japanese subject", message: "chore: 日本語のタイトル", valid: false },
    { label: "an emoji in the subject", message: "chore: emoji 🚀", valid: false },
    { label: "accented latin in the subject", message: "chore: café latte", valid: false },
    {
      // 本文 1 行目の `#nnn` を parser が footer 開始と判定し、body が空文字列になる経路。
      label: "Japanese placed after an issue reference in the body",
      message: ["feat(scope): subject", "", "Issue #2126 のような本文。日本語混入。"].join("\n"),
      valid: false,
    },
  ])("returns $valid for $label", async ({ message, valid }) => {
    const result = await lint(message, rules, opts);

    expect(result.errors.map((e) => e.name)).toStrictEqual(valid ? [] : [name]);
  });
});
