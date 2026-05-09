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
