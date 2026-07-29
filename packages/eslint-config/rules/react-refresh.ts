import eslintPluginReactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";
import { name } from "../utils/name";

/**
 * @param target bundler。ruleは同じで、見逃すexportの指定だけが違う。
 * nextはNext.jsの予約export名を、viteは定数exportを許可する。
 * 既定値はscripts/typegen.tsが引数なしで呼ぶために要る。
 *
 * @returns eslint-plugin-react-refresh
 *
 * @see https://github.com/ArnaudBarre/eslint-plugin-react-refresh
 */
export function reactRefresh(target: "next" | "vite" = "vite") {
  return defineConfig([
    {
      ...eslintPluginReactRefresh.configs[target],
      name: name("react-refresh"),
    },
  ]);
}
