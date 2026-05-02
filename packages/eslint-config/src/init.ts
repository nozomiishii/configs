/** `nozo-eslint-init`: scaffold ESLint config into the consumer project. */
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

// 1. self pkg の name / version と eslint / typescript の pin 値を取得
const selfPkgPath = fileURLToPath(new URL("../package.json", import.meta.url));
const selfPkg = JSON.parse(readFileSync(selfPkgPath, "utf8")) as PackageJson;
const eslintVersion = selfPkg.dependencies?.eslint ?? "10.2.1";
const typescriptVersion = selfPkg.devDependencies?.typescript ?? "6.0.3";

// 2. starter (利用側に書き出す TS) を読み込み
const starterPath = fileURLToPath(new URL("../starter.ts", import.meta.url));
const starter = readFileSync(starterPath, "utf8");

// 3. target package.json を読み込み
const targetPath = path.resolve(process.cwd(), "package.json");
const target = JSON.parse(readFileSync(targetPath, "utf8")) as PackageJson;

// 4. devDependencies に self / eslint / typescript を pin で追加
target.devDependencies = {
  ...target.devDependencies,
  eslint: eslintVersion,
  [selfPkg.name]: selfPkg.version,
  typescript: typescriptVersion,
};

// 5. eslint scripts を追加
target.scripts = {
  ...target.scripts,
  "eslint": "eslint --max-warnings=0 --cache",
  "lint": "pnpm eslint",
  "lint:fix": "pnpm eslint --fix",
};

// 6. package.json を書き戻し
writeFileSync(targetPath, `${JSON.stringify(target, null, 2)}\n`);

// 7. eslint.config.ts を生成
writeFileSync("eslint.config.ts", starter);

process.stdout.write("✓ @nozomiishii/eslint-config installed\n");
