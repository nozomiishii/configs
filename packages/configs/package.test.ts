import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";
import selfPkg from "./package.json" with { type: "json" };

interface PackageJson {
  peerDependencies?: Record<string, string>;
}

const packagesDir = fileURLToPath(new URL("..", import.meta.url));

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

// dependencies は束ねる 6 パッケージと、pnpm-workspace.yaml 編集用の yaml、agent 判定用の detector だけにする。
test("dependencies are the bundled packages plus yaml and package-manager-detector", () => {
  expect(new Set(Object.keys(selfPkg.dependencies))).toStrictEqual(
    new Set([...bundledPackages, "package-manager-detector", "yaml"]),
  );
});

// peerDependencies は子パッケージの peer の和集合と値まで一致させる。
test("peerDependencies match the union of the child peerDependencies", () => {
  expect(selfPkg.peerDependencies).toStrictEqual(unionChildPeerDependencies());
});

// 同じ peer を違う版で宣言している子パッケージが混ざると、和集合が後勝ちで壊れるので先に落とす。
test("the child packages do not disagree on any peer version", () => {
  expect(() => unionChildPeerDependencies()).not.toThrow();
});
