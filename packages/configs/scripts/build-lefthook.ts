/**
 * lefthook の preset を @nozomiishii/lefthook-config から取り込む。
 *
 * lefthook の extends は node の解決を通らず、利用先のルートからの相対パスをそのまま読む。
 * 推移依存の実体パスは利用先から辿れないため、hooks を configs のパッケージルートに置き直し、
 * recommended.yaml の参照先も configs のパスへ書き換える。
 */
import { cp, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const childHooksPath = "node_modules/@nozomiishii/lefthook-config/hooks/";

// lefthook-config の `.` は recommended.yaml なので、その実体からパッケージルートを取る。
const childRoot = path.dirname(
  createRequire(import.meta.url).resolve("@nozomiishii/lefthook-config"),
);
const recommendedPath = path.join(childRoot, "recommended.yaml");
const recommended = await readFile(recommendedPath, "utf-8");

if (!recommended.includes(childHooksPath)) {
  throw new Error(
    `${recommendedPath} no longer extends ${childHooksPath}. Update scripts/build-lefthook.ts.`,
  );
}

const selfHooksPath = "node_modules/@nozomiishii/configs/hooks/";
const selfRoot = fileURLToPath(new URL("..", import.meta.url));
const hooksDir = path.join(selfRoot, "hooks");

await rm(hooksDir, { force: true, recursive: true });
await cp(path.join(childRoot, "hooks"), hooksDir, { recursive: true });

const generatedBy = [
  "# @nozomiishii/lefthook-config/recommended.yaml から生成している。直接編集しない。",
  "# 変更は @nozomiishii/lefthook-config 側に入れて、@nozomiishii/configs を build し直す。",
  "",
  "",
].join("\n");

await writeFile(
  path.join(selfRoot, "recommended.yaml"),
  generatedBy + dropHeader(recommended).replaceAll(childHooksPath, () => selfHooksPath),
);

/**
 * 子の header comment を落とす。configs 側で生成物の注記を 1 つだけ載せるため、
 * 最初の非コメント行より前にある `#` 行と空行はすべて捨てる。
 */
function dropHeader(source: string): string {
  const lines = source.split("\n");
  const firstContent = lines.findIndex((line) => !line.startsWith("#") && line.trim() !== "");

  if (firstContent === -1) {
    throw new Error(`${recommendedPath} has no content outside its header comments.`);
  }

  return lines.slice(firstContent).join("\n");
}
