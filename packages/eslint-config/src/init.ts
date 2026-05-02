/**
 * `nozo-eslint-init` bin.
 *
 * README の "Manual" 手順を JS 化したもの:
 *
 *   1. `pnpm add -D eslint typescript @nozomiishii/eslint-config` 相当の devDependencies 追加
 *   2. eslint 関連の scripts (eslint / lint / lint:fix) を追加
 *   3. ルートに `eslint.config.ts` を生成 (@nozomiishii/eslint-config を re-export)
 *
 * starter は `packages/eslint-config/starter.ts` に「普通の TypeScript」 として置き、
 * このスクリプトが fs で読み取って利用側にそのまま書き出す方式を採る。template literal で
 * ラップしないことで、IDE の構文ハイライトと型チェックがそのまま効く。
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
  version: string;
};

// 1. 自パッケージ (eslint-config) の package.json から name / version、および
//    peer 関係で導入する eslint / typescript の pin version を取得する。
const selfPkgPath = fileURLToPath(new URL("../package.json", import.meta.url));
const selfPkg = JSON.parse(readFileSync(selfPkgPath, "utf8")) as PackageJson;
const eslintVersion = selfPkg.dependencies?.eslint ?? "10.2.1";
const typescriptVersion = selfPkg.devDependencies?.typescript ?? "6.0.3";

// 2. starter テンプレート (利用側に書き出される TypeScript) を読み込む。
//    starter.ts はパッケージルート直下に置かれ、publish 時にそのまま同梱されるため、
//    `dist/init.js` から相対 path (`../starter.ts`) で解決できる。
const starterPath = fileURLToPath(new URL("../starter.ts", import.meta.url));
const starter = readFileSync(starterPath, "utf8");

// 3. target (CWD) の package.json を読み込む。
const targetPath = path.resolve(process.cwd(), "package.json");
const target = JSON.parse(readFileSync(targetPath, "utf8")) as PackageJson;

// 4. devDependencies に @nozomiishii/eslint-config / eslint / typescript を pin で追加する。
target.devDependencies = {
  ...target.devDependencies,
  eslint: eslintVersion,
  [selfPkg.name]: selfPkg.version,
  typescript: typescriptVersion,
};

// 5. eslint 関連の scripts を追加する。
target.scripts = {
  ...target.scripts,
  "eslint": "eslint --max-warnings=0 --cache",
  "lint": "pnpm eslint",
  "lint:fix": "pnpm eslint --fix",
};

// 6. package.json を書き戻す。キー順整列は prettier-plugin-packagejson に任せる。
writeFileSync(targetPath, `${JSON.stringify(target, null, 2)}\n`);

// 7. ルートに eslint.config.ts を生成。
writeFileSync("eslint.config.ts", starter);

// 8. 完了通知 (no-console rule が console.log を許可しないため stdout 直接書き込み)。
process.stdout.write("✓ @nozomiishii/eslint-config installed\n");
