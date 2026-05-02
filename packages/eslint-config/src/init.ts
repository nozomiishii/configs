#!/usr/bin/env node
/**
 * `nozo-eslint-init` bin.
 *
 * README の "Manual" 手順を JS 化したもの:
 *
 *   1. `pnpm add -D eslint typescript @nozomiishii/eslint-config` 相当の devDependencies 追加
 *   2. eslint 関連の scripts (eslint / lint / lint:fix) を追加
 *   3. ルートに `eslint.config.ts` を生成 (@nozomiishii/eslint-config を re-export)
 *
 * このスクリプトは package.json と config file の patch のみを行い、実際の install は
 * 呼び出し側 (`nozo init`) が一括で実行する想定。スタンドアロン実行
 * (`pnpx -p @nozomiishii/eslint-config nozo-eslint-init`) の場合は最後に手動で
 * `pnpm install` する手順となる。
 *
 * 依存バージョンは pin (caret なし) で書き込む。これは Renovate 等の自動更新を前提に
 * するリポジトリポリシーに合わせたもので、PR で明示的にバージョンを上げていく運用。
 *
 * eslint と typescript は本パッケージの peerDependencies であり、利用側の devDeps に
 * 明示的に追加する必要がある。pin 値は本パッケージの dependencies / devDependencies に
 * 書かれた実 version (workspace の Renovate が更新している実値) を使う。
 *
 * bin 命名規則: 既存の `eslint-config` bin (legacy bash scaffold script) は backward
 * compat のため温存する。新規 init bin は `nozo-<pkg>-init` 規則に従う。
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import starter from "./starter.js";

type PackageJson = {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
};

// 1. 自パッケージ (eslint-config) の package.json から name / version、および
//    peer 関係で導入する eslint / typescript の pin version を取得する。
const selfPkgPath = fileURLToPath(new URL("../package.json", import.meta.url));
const selfPkg = JSON.parse(readFileSync(selfPkgPath, "utf8")) as PackageJson;
const eslintVersion = selfPkg.dependencies?.eslint ?? "10.2.1";
const typescriptVersion = selfPkg.devDependencies?.typescript ?? "6.0.3";

// 2. target (CWD) の package.json を読み込む。
const targetPath = resolve(process.cwd(), "package.json");
const target = JSON.parse(readFileSync(targetPath, "utf8")) as PackageJson;

// 3. devDependencies に @nozomiishii/eslint-config / eslint / typescript を pin で追加する。
target.devDependencies = {
  ...(target.devDependencies ?? {}),
  [selfPkg.name]: selfPkg.version,
  eslint: eslintVersion,
  typescript: typescriptVersion,
};

// 4. eslint 関連の scripts を追加する。
target.scripts = {
  ...(target.scripts ?? {}),
  "eslint": "eslint --max-warnings=0 --cache",
  "lint": "pnpm eslint",
  "lint:fix": "pnpm eslint --fix",
};

// 5. package.json を書き戻す。キー順整列は prettier-plugin-packagejson に任せる。
writeFileSync(targetPath, `${JSON.stringify(target, null, 2)}\n`);

// 6. ルートに eslint.config.ts を生成。
writeFileSync("eslint.config.ts", starter);

console.log("✓ @nozomiishii/eslint-config installed");
