// @see https://eslint.org/
// @see https://github.com/nozomiishii/configs/tree/main/packages/eslint-config
import { defineConfig, nextjs } from "@nozomiishii/eslint-config";

export default defineConfig([
  ...nextjs(),

  // エラーの解決手順や、よくある対応パターンはこちらにまとめています:
  // https://github.com/nozomiishii/configs/blob/main/packages/eslint-config/docs/troubleshooting.md
  {
    name: "project/overrides",
    rules: {},
  },
]);
