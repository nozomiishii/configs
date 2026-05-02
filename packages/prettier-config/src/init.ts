/**
 * `nozo-prettier-init` bin.
 *
 * README の "Manual" 手順を JS 化したもの:
 *
 *   1. `pnpm add -D @nozomiishii/prettier-config prettier` 相当の devDependencies 追加
 *   2. `package.json` の `type` を `"module"` に設定 (prettier.config.ts ESM 解釈用)
 *   3. prettier 関連の scripts (format / format:fix / prettier) を追加
 *   4. ルートに `prettier.config.ts` を生成 (@nozomiishii/prettier-config を re-export)
 *
 * starter は `packages/prettier-config/starter.ts` に「普通の TypeScript」 として置き、
 * このスクリプトが fs で読み取って利用側にそのまま書き出す方式を採る。template literal で
 * ラップしないことで、IDE の構文ハイライトと型チェックがそのまま効く。
 *
 * このスクリプトは package.json と config file の patch のみを行い、実際の install は
 * 呼び出し側 (`nozo init`) が一括で実行する想定。スタンドアロン実行
 * (`pnpx -p @nozomiishii/prettier-config nozo-prettier-init`) の場合は最後に手動で
 * `pnpm install` する手順となる。
 *
 * 依存バージョンは pin (caret なし) で書き込む。これは Renovate 等の自動更新を前提に
 * するリポジトリポリシーに合わせたもので、PR で明示的にバージョンを上げていく運用。
 *
 * prettier 本体は本パッケージの dependencies に書かれた実 version (workspace の Renovate
 * が更新している実値) を pin で利用側 devDeps に追加する。
 *
 * shebang は src 側ではなく `tsdown.config.ts` の banner で `dist/init.js` に付与する
 * (`n/hashbang` lint rule が src への shebang を「不要」と判定するため、build 出力に
 * だけ付ける)。
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  name: string;
  scripts?: Record<string, string>;
  type?: string;
  version: string;
};

// 1. 自パッケージ (prettier-config) の package.json から name / version、および
//    prettier の pin version を取得する。
const selfPkgPath = fileURLToPath(new URL("../package.json", import.meta.url));
const selfPkg = JSON.parse(readFileSync(selfPkgPath, "utf8")) as PackageJson;
const prettierVersion = selfPkg.dependencies?.prettier ?? "3.8.3";

// 2. starter テンプレート (利用側に書き出される TypeScript) を読み込む。
//    starter.ts はパッケージルート直下に置かれ、publish 時にそのまま同梱されるため、
//    `dist/init.js` から相対 path (`../starter.ts`) で解決できる。
const starterPath = fileURLToPath(new URL("../starter.ts", import.meta.url));
const starter = readFileSync(starterPath, "utf8");

// 3. target (CWD) の package.json を読み込む。
const targetPath = path.resolve(process.cwd(), "package.json");
const target = JSON.parse(readFileSync(targetPath, "utf8")) as PackageJson;

// 4. ESM 解釈を有効化 (prettier.config.ts を ESM として読むため)。
target.type = "module";

// 5. devDependencies に @nozomiishii/prettier-config / prettier を pin で追加する。
target.devDependencies = {
  ...target.devDependencies,
  prettier: prettierVersion,
  [selfPkg.name]: selfPkg.version,
};

// 6. prettier 関連の scripts を追加する。
target.scripts = {
  ...target.scripts,
  "format": "pnpm prettier . --check",
  "format:fix": "pnpm prettier . --write",
  "prettier": "prettier --ignore-unknown",
};

// 7. package.json を書き戻す。キー順整列は prettier-plugin-packagejson に任せる。
writeFileSync(targetPath, `${JSON.stringify(target, null, 2)}\n`);

// 8. ルートに prettier.config.ts を生成。
writeFileSync("prettier.config.ts", starter);

// 9. 完了通知 (no-console rule が console.log を許可しないため stdout 直接書き込み)。
process.stdout.write("✓ @nozomiishii/prettier-config installed\n");
