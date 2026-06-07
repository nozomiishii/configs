import { defineConfig, node } from "@nozomiishii/eslint-config";

export default defineConfig([
  ...node({ typescript: { tsconfigRootDir: import.meta.dirname } }),

  // エラーの解決手順や、よくある対応パターンはこちらにまとめています:
  // https://github.com/nozomiishii/configs/blob/main/packages/eslint-config/docs/troubleshooting.md
  {
    name: "project/overrides",
    rules: {},
  },
]);
