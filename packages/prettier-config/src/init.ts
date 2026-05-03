/** `nozo-prettier-init`: scaffold Prettier config into the consumer project. */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type PackageJson = {
  devDependencies?: Record<string, string>;
  name: string;
  peerDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  type?: string;
  version: string;
};

// 1. self pkg の name / version と prettier の pin 値を取得
const selfPkgPath = fileURLToPath(new URL("../package.json", import.meta.url));
const selfPkg = JSON.parse(readFileSync(selfPkgPath, "utf8")) as PackageJson & {
  peerDependencies: { prettier: string };
};

// 2. starter (利用側に書き出す TS) を読み込み
const starterPath = fileURLToPath(new URL("../starter.ts", import.meta.url));
const starter = readFileSync(starterPath, "utf8");

// 3. target package.json を読み込み
const targetPath = path.resolve(process.cwd(), "package.json");
const target = JSON.parse(readFileSync(targetPath, "utf8")) as PackageJson;

// 4. type: "module" を設定
target.type = "module";

// 5. devDependencies に self / prettier を pin で追加
target.devDependencies = {
  ...target.devDependencies,
  prettier: selfPkg.peerDependencies.prettier,
  [selfPkg.name]: selfPkg.version,
};

// 6. prettier scripts を追加
target.scripts = {
  ...target.scripts,
  "format": "pnpm prettier . --check",
  "format:fix": "pnpm prettier . --write",
  "prettier": "prettier --ignore-unknown",
};

// 7. package.json を書き戻し
writeFileSync(targetPath, `${JSON.stringify(target, null, 2)}\n`);

// 8. prettier.config.ts を生成
writeFileSync("prettier.config.ts", starter);

process.stdout.write("✓ @nozomiishii/prettier-config installed\n");
