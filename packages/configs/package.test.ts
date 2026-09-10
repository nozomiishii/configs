// hooks/ と recommended.yaml は build が生成するので、このテストの前に pnpm build が要る。
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";
import selfPkg from "./package.json" with { type: "json" };

interface PackageJson {
  exports?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

const packagesDir = fileURLToPath(new URL("..", import.meta.url));
const selfDir = fileURLToPath(new URL(".", import.meta.url));

const bundledPackages = [
  "@nozomiishii/commitlint-config",
  "@nozomiishii/eslint-config",
  "@nozomiishii/lefthook-config",
  "@nozomiishii/oxfmt-config",
  "@nozomiishii/postinstall",
  "@nozomiishii/tsconfig",
];

// packages/<dir>/package.json を読む。dir 名は npm 名から scope を落としたもの。
function readChildPackage(name: string): PackageJson {
  const dir = name.replace("@nozomiishii/", "");

  return JSON.parse(
    readFileSync(path.join(packagesDir, dir, "package.json"), "utf-8"),
  ) as PackageJson;
}

// ディレクトリ配下のファイルを、相対パスと中身の対応表にする。
function readTree(dir: string): Record<string, string> {
  return Object.fromEntries(
    readdirSync(dir, { recursive: true })
      .map(String)
      .filter((entry) => statSync(path.join(dir, entry)).isFile())
      .map((entry) => [entry, readFileSync(path.join(dir, entry), "utf-8")]),
  );
}

// build 生成物のパスを返す。未生成なら pnpm build を促して落とす。
function requireBuilt(target: string): string {
  if (!existsSync(target)) {
    throw new Error(`Run pnpm build first: ${target} not found`);
  }

  return target;
}

/**
 * 子パッケージの peerDependencies を 1 つに束ねる。同じ peer を違う版で宣言している子が居たら、
 * 後勝ちで握り潰さずその場で落とす。
 */
function unionChildPeerDependencies(): Record<string, string> {
  const seen = new Map<string, { declaredBy: string; version: string }>();

  for (const name of bundledPackages) {
    const peers = readChildPackage(name).peerDependencies ?? {};

    for (const [peer, version] of Object.entries(peers)) {
      const known = seen.get(peer);

      if (known !== undefined && known.version !== version) {
        throw new Error(
          `${peer} is declared as ${known.version} by ${known.declaredBy} and as ${version} by ${name}. Align the child peerDependencies before bundling them.`,
        );
      }

      seen.set(peer, { declaredBy: name, version });
    }
  }

  return Object.fromEntries([...seen].map(([peer, { version }]) => [peer, version]));
}

// 利用先は configs だけを直接依存にするので、dependencies は束ねる 6 パッケージだけにする。
test("dependencies are exactly the bundled packages", () => {
  expect(new Set(Object.keys(selfPkg.dependencies))).toStrictEqual(new Set(bundledPackages));
});

// peerDependencies は子パッケージの peer の和集合と値まで一致させる。
test("peerDependencies match the union of the child peerDependencies", () => {
  expect(selfPkg.peerDependencies).toStrictEqual(unionChildPeerDependencies());
});

// 同じ peer を違う版で宣言している子パッケージが混ざると、和集合が後勝ちで壊れるので先に落とす。
test("the child packages do not disagree on any peer version", () => {
  expect(() => unionChildPeerDependencies()).not.toThrow();
});

// 利用先が触るサブパスはこの 8 種。利用先の設定ファイルはすべてこれを指す。
test("exports cover every subpath the consumer refers to", () => {
  expect(new Set(Object.keys(selfPkg.exports))).toStrictEqual(
    new Set([
      "./commitlint",
      "./eslint",
      "./hooks/*",
      "./init",
      "./lefthook",
      "./oxfmt",
      "./package.json",
      "./tsconfig/*.json",
    ]),
  );
});

// hooks は build 時に lefthook-config からコピーする。正本は子のまま。
test("the copied hooks are identical to the lefthook-config hooks", () => {
  const hooksDir = requireBuilt(path.join(selfDir, "hooks"));

  expect(readTree(hooksDir)).toStrictEqual(
    readTree(path.join(packagesDir, "lefthook-config", "hooks")),
  );
});

// tsconfig の中継は @nozomiishii/tsconfig の exports をそのまま網羅する。
test("the tsconfig relays cover every tsconfig of @nozomiishii/tsconfig", () => {
  const relayDir = path.join(selfDir, "tsconfig");
  const targets = readdirSync(relayDir).map(
    (file) =>
      (JSON.parse(readFileSync(path.join(relayDir, file), "utf-8")) as { extends: string }).extends,
  );

  const exported = Object.keys(readChildPackage("@nozomiishii/tsconfig").exports ?? {})
    .filter((key) => key.startsWith("./tsconfig"))
    .map((key) => `@nozomiishii/tsconfig/${key.slice(2)}`);

  expect(new Set(targets)).toStrictEqual(new Set(exported));
});

// 生成した recommended.yaml の header は 1 つだけにする。子の header を残すと注記が二重になる。
test("the generated recommended.yaml carries a single header block", () => {
  const generated = readFileSync(requireBuilt(path.join(selfDir, "recommended.yaml")), "utf-8");

  const blocks =
    generated
      .split("\n")
      .map((line) => (line.startsWith("#") ? "#" : "."))
      .join("")
      .match(/#+/g) ?? [];

  expect(blocks).toHaveLength(1);
});

// 生成した recommended.yaml の extends は、利用先から辿れる configs 配下のパスに書き換わっている。
test("the generated recommended.yaml extends the hooks under the configs package", () => {
  const generated = readFileSync(requireBuilt(path.join(selfDir, "recommended.yaml")), "utf-8");

  const extended = generated.split("\n").filter((line) => line.trim().startsWith("- "));

  expect(
    extended.filter((line) => line.includes("node_modules/@nozomiishii/configs/hooks/")),
  ).toStrictEqual(extended);
});
