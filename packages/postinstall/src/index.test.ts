import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";

// fresh install 用の stub が package import で lint を迂回しないことを検証する
test("postinstall bin imports its built entry with an explicit extension", () => {
  const bin = readFileSync(path.resolve(import.meta.dirname, "../bin/postinstall.js"), "utf8");

  expect(bin).toMatch(/^import "\.\.\/dist\/.+\.js";$/m);
});
