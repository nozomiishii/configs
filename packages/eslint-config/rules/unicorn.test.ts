import { ESLint } from "eslint";
import { expect, test } from "vitest";
import { unicorn } from "./unicorn";

async function lint(code: string) {
  const eslint = new ESLint({
    overrideConfig: unicorn(),
    overrideConfigFile: true,
  });

  const results = await eslint.lintText(code);

  return results.flatMap(({ messages }) => messages.map(({ ruleId }) => ruleId));
}

// 非 String receiver の replace は no-unsafe-string-replacement の対象外。
test("allows replace on a typed non-string receiver", async () => {
  await expect(
    lint(`
      declare const pathname: string;
      declare const router: { replace(href: string, options: object): void };

      router.replace(pathname, { locale: "ja" });
    `),
  ).resolves.not.toContain("unicorn/no-unsafe-string-replacement");
});

// String receiver の動的 replacement は引き続き検出する。
test("reports unsafe replacement on a string receiver", async () => {
  await expect(lint('template.replace("{url}", htmlEscape(url));')).resolves.toContain(
    "unicorn/no-unsafe-string-replacement",
  );
});
