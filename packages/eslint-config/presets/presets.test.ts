import { expect, test } from "vitest";
import { base } from "./base";
import { nextjs } from "./nextjs";
import { node } from "./node";

// flat config 配列から name 一覧を取り出す
function names(configs: { name?: string }[]) {
  return configs.map((config) => config.name).filter(Boolean);
}

// base は言語土台を含む
test("base includes the javascript preset", () => {
  expect(names(base())).toContain("@nozomiishii/javascript");
});

// base はフレームワークルールを含まない
test("base excludes framework rules", () => {
  expect(names(base()).join(" ")).not.toMatch(/react|nextjs|tailwind|storybook|playwright/);
});

// base はランタイム層(n)を含まない
test("base excludes the Node.js layer", () => {
  expect(names(base())).not.toContain("@nozomiishii/n");
});

// node は base の言語土台を内包する
test("node includes the base language layer", () => {
  expect(names(node())).toContain("@nozomiishii/javascript");
});

// node は eslint-plugin-n のランタイム層を足す
test("node adds the Node.js layer", () => {
  expect(names(node())).toContain("@nozomiishii/n");
});

// node は web 層を含まない
test("node excludes the web layer", () => {
  expect(names(node()).join(" ")).not.toMatch(/react|nextjs/);
});

// nextjs は node の層を内包する
test("nextjs includes the Node.js layer", () => {
  expect(names(nextjs())).toContain("@nozomiishii/n");
});

// nextjs は @next plugin を含む
test("nextjs includes the nextjs rule", () => {
  expect(names(nextjs())).toContain("@nozomiishii/nextjs");
});

// nextjs は react 層を足す
test("nextjs adds the react layer", () => {
  expect(names(nextjs()).join(" ")).toMatch(/react/);
});
