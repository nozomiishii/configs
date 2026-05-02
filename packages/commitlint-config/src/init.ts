/** `nozo-commitlint-init`: scaffold commitlint config into the consumer project. */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type PackageJson = {
  devDependencies?: Record<string, string>;
  name: string;
  version: string;
};

// 1. self pkg の name / version を取得
const selfPkgPath = fileURLToPath(new URL("../package.json", import.meta.url));
const selfPkg = JSON.parse(readFileSync(selfPkgPath, "utf8")) as PackageJson;

// 2. starter (利用側に書き出す TS) を読み込み
const starterPath = fileURLToPath(new URL("../starter.ts", import.meta.url));
const starter = readFileSync(starterPath, "utf8");

// 3. target package.json を読み込み
const targetPath = path.resolve(process.cwd(), "package.json");
const target = JSON.parse(readFileSync(targetPath, "utf8")) as PackageJson;

// 4. devDependencies に self を pin で追加
target.devDependencies = {
  ...target.devDependencies,
  [selfPkg.name]: selfPkg.version,
};

// 5. package.json を書き戻し
writeFileSync(targetPath, `${JSON.stringify(target, null, 2)}\n`);

// 6. commitlint.config.ts を生成
writeFileSync("commitlint.config.ts", starter);

process.stdout.write("✓ @nozomiishii/commitlint-config installed\n");
