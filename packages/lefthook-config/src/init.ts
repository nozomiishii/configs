#!/usr/bin/env node
/**
 * `nozo-lefthook-init` bin.
 *
 * README の "Manual setup" を JS 化したもの:
 *
 *   1. `pnpm add -D lefthook @nozomiishii/lefthook-config` 相当の devDependencies 追加
 *   2. ルートに `lefthook.yaml` を生成 (recommended.yaml を extends する starter)
 *
 * このスクリプトは package.json と config file の patch のみを行い、実際の install は
 * 呼び出し側 (`nozo init`) が一括で実行する想定。スタンドアロン実行
 * (`pnpx nozo-lefthook-init`) の場合は最後に手動で `pnpm install` する手順となる。
 *
 * 依存バージョンは pin (caret なし) で書き込む。これは Renovate 等の自動更新を前提に
 * するリポジトリポリシーに合わせたもので、PR で明示的にバージョンを上げていく運用。
 *
 * bin 命名規則: 各 config パッケージの既存 bin (例: `nozo-commitlint` = commit-msg lint
 * 実行 shim、`nozo-git-harvest` = git-harvest shim) と衝突させないため、init scaffold
 * 用 bin は `-init` suffix で統一する。
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import starter from "../starter.yaml";

type PackageJson = {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

// 1. 自パッケージ (lefthook-config) の package.json から name / version、
//    および peer 関係で導入する lefthook の pin version を取得する。
const selfPkgPath = fileURLToPath(new URL("../package.json", import.meta.url));
const selfPkg = JSON.parse(readFileSync(selfPkgPath, "utf8")) as PackageJson;
const lefthookVersion = selfPkg.dependencies?.lefthook ?? "2.1.6";

// 2. target (CWD) の package.json を読み込む。
const targetPath = resolve(process.cwd(), "package.json");
const target = JSON.parse(readFileSync(targetPath, "utf8")) as PackageJson;

// 3. devDependencies に @nozomiishii/lefthook-config と lefthook を pin で追加する。
//    既存 entries は維持、同名キーがあれば pin version で上書き。
target.devDependencies = {
  ...(target.devDependencies ?? {}),
  [selfPkg.name]: selfPkg.version,
  lefthook: lefthookVersion,
};

// 4. package.json を書き戻す。キー順整列は prettier-plugin-packagejson に任せる
//    (commit 前の format / format:fix で自動的に整う)。
writeFileSync(targetPath, `${JSON.stringify(target, null, 2)}\n`);

// 5. ルートに lefthook.yaml を生成。中身は packages/lefthook-config/starter.yaml を
//    tsdown loader (".yaml": "text") で string inline したもの。
writeFileSync("lefthook.yaml", starter);

console.log("✓ @nozomiishii/lefthook-config installed");
