import { defineConfig } from "eslint/config";
import { node } from "./presets/node";

export default defineConfig([
  ...node({ typescript: { tsconfigRootDir: import.meta.dirname } }),

  // ESM の bin スクリプトは相対 import に .js 拡張子が必須
  {
    files: ["bin/**/*.js"],
    rules: {
      "import-x/extensions": "off",
    },
  },
]);
