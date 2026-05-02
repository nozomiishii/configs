/**
 * `nozo-commitlint-init` bin.
 *
 * README の "Usage" 手順を JS 化したもの:
 *
 *   1. `pnpm add -D @nozomiishii/commitlint-config` 相当の devDependencies 追加
 *   2. ルートに `commitlint.config.ts` を生成 (extends で `@nozomiishii/commitlint-config` を参照)
 *
 * starter は `packages/commitlint-config/starter.ts` に「普通の TypeScript」 として置き、
 * このスクリプトが fs で読み取って利用側にそのまま書き出す方式を採る。template literal で
 * ラップしないことで、IDE の構文ハイライトと型チェックがそのまま効く。
 *
 * このスクリプトは package.json と config file の patch のみを行い、実際の install は
 * 呼び出し側 (`nozo init`) が一括で実行する想定。スタンドアロン実行
 * (`pnpx nozo-commitlint-init`) の場合は最後に手動で `pnpm install` する手順となる。
 *
 * 依存バージョンは pin (caret なし) で書き込む。これは Renovate 等の自動更新を前提に
 * するリポジトリポリシーに合わせたもので、PR で明示的にバージョンを上げていく運用。
 *
 * bin 命名規則: 既存の `nozo-commitlint` (commit-msg lint shim) と衝突させないため、
 * init scaffold 用 bin は `-init` suffix で統一する。
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
  version: string;
};

// 1. 自パッケージ (commitlint-config) の package.json から name / version を取得する。
const selfPkgPath = fileURLToPath(new URL("../package.json", import.meta.url));
const selfPkg = JSON.parse(readFileSync(selfPkgPath, "utf8")) as PackageJson;

// 2. starter テンプレート (利用側に書き出される TypeScript) を読み込む。
//    starter.ts はパッケージルート直下に置かれ、publish 時にそのまま同梱されるため、
//    `dist/init.js` から相対 path (`../starter.ts`) で解決できる。
const starterPath = fileURLToPath(new URL("../starter.ts", import.meta.url));
const starter = readFileSync(starterPath, "utf8");

// 3. target (CWD) の package.json を読み込む。
const targetPath = path.resolve(process.cwd(), "package.json");
const target = JSON.parse(readFileSync(targetPath, "utf8")) as PackageJson;

// 4. devDependencies に @nozomiishii/commitlint-config を pin で追加する。
target.devDependencies = {
  ...target.devDependencies,
  [selfPkg.name]: selfPkg.version,
};

// 5. package.json を書き戻す。キー順整列は prettier-plugin-packagejson に任せる
//    (commit 前の format / format:fix で自動的に整う)。
writeFileSync(targetPath, `${JSON.stringify(target, null, 2)}\n`);

// 6. ルートに commitlint.config.ts を生成。
writeFileSync("commitlint.config.ts", starter);

// 7. 完了通知 (no-console rule が console.log を許可しないため stdout 直接書き込み)。
process.stdout.write("✓ @nozomiishii/commitlint-config installed\n");
