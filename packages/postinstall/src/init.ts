/** `nozo-postinstall-init`: scaffold the postinstall hook into the consumer project. */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type PackageJson = {
  devDependencies?: Record<string, string>;
  name: string;
  scripts?: Record<string, string>;
  version: string;
};

// 1. self pkg の name / version を取得
const selfPkgPath = fileURLToPath(new URL("../package.json", import.meta.url));
const selfPkg = JSON.parse(readFileSync(selfPkgPath, "utf8")) as PackageJson;

// 2. target package.json を読み込み
const targetPath = path.resolve(process.cwd(), "package.json");
const target = JSON.parse(readFileSync(targetPath, "utf8")) as PackageJson;

// 3. devDependencies に self を pin で追加
target.devDependencies = {
  ...target.devDependencies,
  [selfPkg.name]: selfPkg.version,
};

// 4. scripts.postinstall を設定
target.scripts = {
  ...target.scripts,
  postinstall: "postinstall",
};

// 5. package.json を書き戻し
writeFileSync(targetPath, `${JSON.stringify(target, null, 2)}\n`);

process.stdout.write("✓ @nozomiishii/postinstall installed\n");
