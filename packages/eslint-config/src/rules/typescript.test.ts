import { Linter } from "eslint";
import tseslint from "typescript-eslint";
import { expect, test } from "vitest";
import { nextjs, node, tanstackStart } from "../..";

const presets = [
  ["nextjs", nextjs],
  ["node", node],
  ["tanstack-start", tanstackStart],
] as const;

// preset の config 配列から consistent-type-definitions を持つ config を出現順に集める。
// 最後の 1 件が実効値。severity は typescript-eslint の共有 config が配り、
// option 指定が無いため向きは rule 本体の既定 (interface) に落ちる。
function effective(configs: readonly Linter.Config[]): { entry: Linter.RuleEntry; name: string } {
  const hits = configs.flatMap((config) => {
    const entry = config.rules?.["@typescript-eslint/consistent-type-definitions"];

    return entry === undefined ? [] : [{ entry, name: config.name ?? "" }];
  });
  const last = hits.at(-1);

  if (last === undefined) {
    throw new Error("consistent-type-definitions is not configured");
  }

  return last;
}

function lint(
  entry: Linter.RuleEntry,
  code: string,
): { messages: Linter.LintMessage[]; output: string } {
  const linter = new Linter();
  const { messages, output } = linter.verifyAndFix(code, {
    languageOptions: { parser: tseslint.parser },
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: { "@typescript-eslint/consistent-type-definitions": entry },
  });

  return { messages, output };
}

// 各 preset は rule を上書きせず、typescript-eslint の共有 config (既定: interface) に委ねる。
// "type" 強制に戻すと declare module 内の interface Register が autofix で壊れる (#2800)。
test.for(presets)("%s delegates consistent-type-definitions to typescript-eslint", ([, preset]) => {
  expect(effective(preset()).name).toMatch(/^typescript-eslint\//v);
});

// declare module 内の interface は declaration merging に必須。報告も autofix もされないことを固定する。
test.for(presets)("%s keeps interface inside declare module intact", ([, preset]) => {
  const code = 'declare module "some-library" { interface Register { router: number } }';
  const { messages, output } = lint(effective(preset()).entry, code);

  expect(messages).toStrictEqual([]);
  expect(output).toBe(code);
});

// オブジェクトリテラルの type 宣言は interface へ autofix される (既定の向きが interface であることの固定)。
test.for(presets)("%s fixes plain object literal type alias to interface", ([, preset]) => {
  const { messages, output } = lint(
    effective(preset()).entry,
    "export type Probe = { locale: string };",
  );

  expect(messages).toStrictEqual([]);
  expect(output).toContain("export interface Probe");
});
