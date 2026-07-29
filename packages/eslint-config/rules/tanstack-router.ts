import tanstackRouterPlugin from "@tanstack/eslint-plugin-router";
import { defineConfig } from "eslint/config";
import { name } from "../utils/name";

/**
 * @returns `@tanstack/eslint-plugin-router`
 *
 * route-param-namesはTanStack Routerのimportがあるファイルだけを見るが、
 * create-route-property-orderはcalleeの名前しか見ない。
 * 別packageのcreateRouteにも当たるため、誤検知が出たらconsumer側でfilesを絞る。
 *
 * @see https://tanstack.com/router/latest/docs/eslint/eslint-plugin-router
 * @see https://github.com/TanStack/router/tree/main/packages/eslint-plugin-router
 */
export function tanstackRouter() {
  return defineConfig(
    // 要素が増えても落とさないよう配列のまま扱う。upstream は name を持たない。
    tanstackRouterPlugin.configs["flat/recommended"].map((config) => ({
      ...config,
      name: name("tanstack-router"),
    })),
  );
}
