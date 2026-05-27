import lint from "@commitlint/lint";
import { describe, expect, it } from "vitest";

import config from "./index.js";

describe("scope-empty (default deny scope)", () => {
  it("default config に scope-empty: [2, 'always'] が登録されている", () => {
    expect(config.rules?.["scope-empty"]).toEqual([2, "always"]);
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

// rule 本体の検証は src/rules/<rule-name>/index.test.ts に co-located。
// ここでは compose 結果として custom rule が plugin / severity 両方に登録されることを固定する。
describe("custom rules composition", () => {
  it("各 custom rule の callback が plugin に登録されている", () => {
    const plugin = config.plugins?.[0];
    if (!plugin || typeof plugin === "string") {
      throw new Error("commitlint plugin not configured");
    }
    expect(typeof plugin.rules["commit-message-ascii-only"]).toBe("function");
    expect(typeof plugin.rules["breaking-change-requires-bang"]).toBe("function");
  });

  it("各 custom rule の severity が [2, 'always'] で登録されている", () => {
    expect(config.rules?.["commit-message-ascii-only"]).toEqual([2, "always"]);
    expect(config.rules?.["breaking-change-requires-bang"]).toEqual([2, "always"]);
  });
});
