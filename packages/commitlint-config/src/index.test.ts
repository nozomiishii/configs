import lint from "@commitlint/lint";
import { describe, expect, test } from "vitest";
import config from ".";

function pluginRules() {
  const plugin = config.plugins?.[0];

  if (!plugin || typeof plugin === "string") {
    throw new Error("commitlint plugin not configured");
  }

  return plugin.rules;
}

describe("scope-empty (default deny scope)", () => {
  // 既定で scope-empty をエラーとして登録する。
  test("registers scope-empty as an error by default", () => {
    expect(config.rules?.["scope-empty"]).toStrictEqual([2, "always"]);
  });

  // scope 付きコミットを拒否する。
  test("rejects a commit with a scope", async () => {
    const result = await lint("feat(api): add foo", { "scope-empty": [2, "always"] } as const);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.name === "scope-empty")).toBe(true);
  });

  // consumer が scope-empty を無効化した場合は scope 付きコミットを許可する。
  test("allows a scoped commit when the consumer disables scope-empty", async () => {
    const result = await lint("feat(api): add foo", { "scope-empty": [0, "always"] } as const);

    expect(result.valid).toBe(true);
  });
});

// rule 本体の検証は src/rules/<rule-name>/index.test.ts に co-located。
// ここでは compose 結果として custom rule が plugin / severity 両方に登録されることを固定する。
describe("custom rules composition", () => {
  // custom rule の callback を plugin に登録する。
  test("registers custom rule callbacks in the plugin", () => {
    const rules = pluginRules();

    expect(rules["breaking-change-requires-bang"]).toBeTypeOf("function");
    expect(rules["commit-message-ascii-only"]).toBeTypeOf("function");
  });

  // custom rule の severity をエラーとして登録する。
  test("registers custom rule severities as errors", () => {
    expect(config.rules?.["commit-message-ascii-only"]).toStrictEqual([2, "always"]);
    expect(config.rules?.["breaking-change-requires-bang"]).toStrictEqual([2, "always"]);
  });
});
