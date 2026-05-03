/** `nozo-lefthook-init`: scaffold lefthook config into the consumer project. */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import starter from "../starter.yaml";

type PackageJson = {
  name: string;
  version: string;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

// 1. self pkg の name / version と lefthook の pin 値を取得
const selfPkgPath = fileURLToPath(new URL("../package.json", import.meta.url));
const selfPkg = JSON.parse(readFileSync(selfPkgPath, "utf8")) as PackageJson & {
  peerDependencies: { lefthook: string };
};

// 2. target package.json を読み込み
const targetPath = resolve(process.cwd(), "package.json");
const target = JSON.parse(readFileSync(targetPath, "utf8")) as PackageJson;

// 3. devDependencies に self / lefthook を pin で追加
target.devDependencies = {
  ...target.devDependencies,
  [selfPkg.name]: selfPkg.version,
  lefthook: selfPkg.peerDependencies.lefthook,
};

// 4. package.json を書き戻し
writeFileSync(targetPath, `${JSON.stringify(target, null, 2)}\n`);

// 5. lefthook.yaml を生成
writeFileSync("lefthook.yaml", starter);

process.stdout.write("✓ @nozomiishii/lefthook-config installed\n");
