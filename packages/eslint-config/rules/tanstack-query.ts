import tanstackQueryPlugin from "@tanstack/eslint-plugin-query";
import { defineConfig } from "eslint/config";
import { name } from "../utils/name";

/**
 * @returns `@tanstack/eslint-plugin-query`
 *
 * どのruleも`@tanstack/`で始まり`-query`で終わるpackageからのimportがある
 * ファイルだけを見るため、queryを使わないprojectに入れても何も報告しない。
 *
 * recommendedではなくrecommended-strictを使う。差はprefer-query-optionsの1つで、
 * queryKeyとqueryFnをqueryOptions()に閉じ込めさせる。
 *
 * @see https://tanstack.com/query/latest/docs/eslint/eslint-plugin-query
 * @see https://github.com/TanStack/query/tree/main/packages/eslint-plugin-query
 */
export function tanstackQuery() {
  return defineConfig(
    // 要素が増えても落とさないよう配列のまま扱う。upstream の name は付け替える。
    tanstackQueryPlugin.configs["flat/recommended-strict"].map((config) => ({
      ...config,
      name: name("tanstack-query"),
    })),
  );
}
