import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, onTestFinished, test } from "vitest";

const packagesDir = fileURLToPath(new URL("../..", import.meta.url));

const childPackages = [
  "commitlint-config",
  "eslint-config",
  "lefthook-config",
  "oxfmt-config",
  "postinstall",
  "tsconfig",
];

// 公開後の利用先を再現する。子パッケージは npm ではなくローカル tarball を使うため overrides で差し替える。
function createConsumer(root: string): string {
  const consumer = path.join(root, "consumer");
  mkdirSync(consumer);

  const overrides = childPackages
    .map((dir) => `  "@nozomiishii/${dir}": "file:${pack(dir, root)}"`)
    .join("\n");

  writeFileSync(
    path.join(consumer, "package.json"),
    `${JSON.stringify(
      {
        devDependencies: { "@nozomiishii/configs": `file:${pack("configs", root)}` },
        name: "consumer",
        private: true,
        version: "1.0.0",
      },
      null,
      2,
    )}\n`,
  );

  writeFileSync(
    path.join(consumer, "pnpm-workspace.yaml"),
    `publicHoistPattern:\n  - "@nozomiishii/*"\n\noverrides:\n${overrides}\n`,
  );

  return consumer;
}

/**
 * packages/<dir> を tarball にして、その絶対パスを返す。dist が要るので事前に build しておく。
 */
function pack(dir: string, destination: string): string {
  const output = execFileSync("pnpm", ["pack", "--pack-destination", destination], {
    cwd: path.join(packagesDir, dir),
    encoding: "utf-8",
  });
  const tarball = output.trim().split("\n").at(-1);

  if (!tarball?.endsWith(".tgz")) {
    throw new Error(`pnpm pack reported no tarball for ${dir}: ${output}`);
  }

  return tarball;
}

// publicHoistPattern に @nozomiishii/* を入れると、推移依存の bin と lefthook の hooks が利用先から見える。
// 公式ドキュメントに書かれていない挙動なので、実際に install して確かめる。
test("public hoisting exposes the child bins and the lefthook hooks", () => {
  const root = mkdtempSync(path.join(tmpdir(), "nozo-configs-hoist-"));
  onTestFinished(() => {
    rmSync(root, { force: true, recursive: true });
  });

  const consumer = createConsumer(root);

  execFileSync("pnpm", ["install", "--ignore-scripts"], { cwd: consumer, stdio: "pipe" });

  const expected = [
    "node_modules/.bin/nozo-commitlint",
    "node_modules/.bin/nozo-git-harvest",
    "node_modules/.bin/postinstall",
    // 利用先の eslint.config.ts / commitlint.config.ts / oxfmt.config.ts / tsconfig の extends が解決する先。
    "node_modules/@nozomiishii/commitlint-config",
    "node_modules/@nozomiishii/eslint-config",
    "node_modules/@nozomiishii/lefthook-config/hooks",
    "node_modules/@nozomiishii/oxfmt-config",
    "node_modules/@nozomiishii/tsconfig",
  ];

  expect(expected.filter((entry) => existsSync(path.join(consumer, entry)))).toStrictEqual(
    expected,
  );
});
