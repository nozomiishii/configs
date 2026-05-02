/**
 * `nozo-postinstall-init` bin.
 *
 * README の "Usage" 手順を JS 化したもの:
 *
 *   1. `pnpm add -D @nozomiishii/postinstall` 相当の devDependencies 追加
 *   2. `package.json` の `scripts.postinstall` に `"postinstall"` を設定 (本パッケージが
 *      提供する `postinstall` bin が `pnpm install` のたびに走るようにする)
 *
 * このスクリプトは package.json の patch のみを行い、実際の install は呼び出し側
 * (`nozo init`) が一括で実行する想定。スタンドアロン実行
 * (`pnpx -p @nozomiishii/postinstall nozo-postinstall-init`) の場合は最後に手動で
 * `pnpm install` する手順となる。本パッケージは config file を生成しないため、
 * 他の `nozo-<pkg>-init` bin と異なり `starter.ts` は持たない。
 *
 * 依存バージョンは pin (caret なし) で書き込む。これは Renovate 等の自動更新を前提に
 * するリポジトリポリシーに合わせたもので、PR で明示的にバージョンを上げていく運用。
 *
 * shebang は src 側ではなく `tsdown.config.ts` の banner で `dist/init.js` に付与する
 * (`n/hashbang` lint rule が src への shebang を「不要」と判定するため、build 出力に
 * だけ付ける)。
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type PackageJson = {
  devDependencies?: Record<string, string>;
  name: string;
  scripts?: Record<string, string>;
  version: string;
};

// 1. 自パッケージ (postinstall) の package.json から name / version を取得する。
const selfPkgPath = fileURLToPath(new URL("../package.json", import.meta.url));
const selfPkg = JSON.parse(readFileSync(selfPkgPath, "utf8")) as PackageJson;

// 2. target (CWD) の package.json を読み込む。
const targetPath = path.resolve(process.cwd(), "package.json");
const target = JSON.parse(readFileSync(targetPath, "utf8")) as PackageJson;

// 3. devDependencies に @nozomiishii/postinstall を pin で追加する。
target.devDependencies = {
  ...target.devDependencies,
  [selfPkg.name]: selfPkg.version,
};

// 4. `scripts.postinstall` に `postinstall` (= 本パッケージの bin name) を設定する。
target.scripts = {
  ...target.scripts,
  postinstall: "postinstall",
};

// 5. package.json を書き戻す。キー順整列は prettier-plugin-packagejson に任せる。
writeFileSync(targetPath, `${JSON.stringify(target, null, 2)}\n`);

// 6. 完了通知 (no-console rule が console.log を許可しないため stdout 直接書き込み)。
process.stdout.write("✓ @nozomiishii/postinstall installed\n");
