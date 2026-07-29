import eslintPluginReactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";
import { name } from "../utils/name";

/**
 * bundler ごとの config 名。plugin 側が増減しても追随するよう型から引く。
 */
export type ReactRefreshTarget = keyof typeof eslintPluginReactRefresh.configs;

/**
 * @param target rule は同じで、見逃す export の指定だけが違う。
 * next は Next.js の予約 export 名を、vite は定数 export を許可する。
 *
 * @returns eslint-plugin-react-refresh
 *
 * @see https://github.com/ArnaudBarre/eslint-plugin-react-refresh
 */
export function reactRefresh(target: ReactRefreshTarget) {
  return defineConfig([
    {
      ...eslintPluginReactRefresh.configs[target],
      name: name("react-refresh"),
    },
  ]);
}
