import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";
import selfPkg from "../package.json" with { type: "json" };

interface Fixtures {
  consumer: string;
}

const packagesDir = fileURLToPath(new URL("../..", import.meta.url));

const childPackages = [
  "commitlint-config",
  "eslint-config",
  "lefthook-config",
  "oxfmt-config",
  "postinstall",
  "tsconfig",
];

/**
 * 公開後の利用先を再現する。publicHoistPattern は書かず、利用先が触るのは
 * `@nozomiishii/configs/...` と `node_modules/.bin` だけにする。
 * 子パッケージは npm ではなくローカル tarball を使うため overrides で差し替える。
 */
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
        // nozo init が書くのと同じ形にする。版は meta の peer をそのまま使い、ここには持たない。
        devDependencies: {
          "@nozomiishii/configs": `file:${pack("configs", root)}`,
          ...selfPkg.peerDependencies,
        },
        name: "consumer",
        private: true,
        version: "1.0.0",
      },
      null,
      2,
    )}\n`,
  );

  writeFileSync(path.join(consumer, "pnpm-workspace.yaml"), `overrides:\n${overrides}\n`);

  // ESLint preset が読む。利用先の設定ファイルは nozo init が書くものと同じ形にする。
  writeFileSync(path.join(consumer, ".gitignore"), "");
  writeFileSync(
    path.join(consumer, "commitlint.config.ts"),
    'export default { extends: ["@nozomiishii/configs/commitlint"] };\n',
  );
  writeFileSync(
    path.join(consumer, "eslint.config.ts"),
    'import { defineConfig, node } from "@nozomiishii/configs/eslint";\n\nexport default defineConfig([...node()]);\n',
  );
  writeFileSync(path.join(consumer, "sample.ts"), "export const sample = 1;\n");
  writeFileSync(
    path.join(consumer, "tsconfig.json"),
    `${JSON.stringify(
      { extends: "@nozomiishii/configs/tsconfig/nextjs.json", include: ["sample.ts"] },
      null,
      2,
    )}\n`,
  );
  writeFileSync(
    path.join(consumer, "lefthook.yaml"),
    "extends:\n  - ./node_modules/@nozomiishii/configs/recommended.yaml\n",
  );

  execFileSync("pnpm", ["install", "--ignore-scripts"], { cwd: consumer, stdio: "pipe" });

  // git repo の外では lefthook が exit 128 になる。
  execFileSync("git", ["init", "--quiet"], { cwd: consumer, stdio: "pipe" });

  return consumer;
}

/**
 * packages/<dir> を tarball にして、その絶対パスを返す。dist と build 生成物が要るので事前に build しておく。
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

/**
 * tarball から install した利用先を 1 度だけ用意して、ファイル内の全テストで使い回す。
 * pack と install が重いので、テストごとには作り直さない。テストはここから読むだけにする。
 */
const it = test.extend<Fixtures>({
  consumer: [
    // vitest は fixture の第 1 引数に分割代入を要求し、eslint は空の分割代入を許さないので受けるだけ受ける。
    async ({ task: _task }, use) => {
      const root = mkdtempSync(path.join(tmpdir(), "nozo-configs-install-"));

      await use(createConsumer(root));

      rmSync(root, { force: true, recursive: true });
    },
    { scope: "file" },
  ],
});

// meta が持つ wrapper bin は、hoist 無しでも利用先の .bin に並ぶ。
it("the wrapper bins are linked into node_modules/.bin", ({ consumer }) => {
  const bins = ["commitlint", "nozo-commitlint", "nozo-git-harvest", "postinstall"];

  expect(
    bins.filter((bin) => existsSync(path.join(consumer, "node_modules/.bin", bin))),
  ).toStrictEqual(bins);
});

// wrapper bin は子パッケージの cli を推移依存のまま解決して起動する。
it("the commitlint wrapper bin runs", ({ consumer }) => {
  expect(() =>
    execFileSync(path.join(consumer, "node_modules/.bin/nozo-commitlint"), ["--help"], {
      cwd: consumer,
      stdio: "pipe",
    }),
  ).not.toThrow();
});

// commitlint 自身の resolver が `@nozomiishii/configs/commitlint` を辿れて、規約通りの message は通る。
it("commitlint accepts a conventional message through the configs subpath", ({ consumer }) => {
  expect(lintCommitMessage(consumer, "feat: ok")).toBe(0);
});

// 同じ経路で読んだ規約に反する message は落ちる。extends が空振りしていないことの裏取り。
it("commitlint rejects an invalid message through the configs subpath", ({ consumer }) => {
  expect(lintCommitMessage(consumer, "not a conventional commit")).not.toBe(0);
});

// dist に置いた commitlint / oxfmt のサブパスは、そのまま import できる。
it("the built config subpaths are importable", ({ consumer }) => {
  expect(() =>
    execFileSync(
      "node",
      [
        "-e",
        'await import("@nozomiishii/configs/commitlint"); await import("@nozomiishii/configs/oxfmt");',
      ],
      { cwd: consumer, stdio: "pipe" },
    ),
  ).not.toThrow();
});

// eslint.config.ts から `@nozomiishii/configs/eslint` を読み、plugin まで解決できる。
it("the eslint subpath resolves from the consumer config", ({ consumer }) => {
  expect(() =>
    execFileSync(path.join(consumer, "node_modules/.bin/eslint"), ["--print-config", "sample.ts"], {
      cwd: consumer,
      stdio: "pipe",
    }),
  ).not.toThrow();
});

// tsconfig の中継は @nozomiishii/tsconfig まで extends を辿れる。
it("the tsconfig relay resolves through tsc", ({ consumer }) => {
  const config = execFileSync(path.join(consumer, "node_modules/.bin/tsc"), ["--showConfig"], {
    cwd: consumer,
    encoding: "utf-8",
  });

  expect(JSON.parse(config)).toHaveProperty("compilerOptions.jsx");
});

// lefthook は利用先のルートからの相対パスで hooks を読む。configs 配下に置いた hooks も解決できる。
it("lefthook resolves the hooks through the configs preset", ({ consumer }) => {
  const dump = execFileSync(path.join(consumer, "node_modules/.bin/lefthook"), ["dump"], {
    cwd: consumer,
    encoding: "utf-8",
  });

  expect(dump).toContain("nozo-commitlint");
});

/**
 * 利用先の commitlint.config.ts を明示指定して、message を stdin から lint し、終了コードを返す。
 */
function lintCommitMessage(consumer: string, message: string): null | number {
  const { status } = spawnSync(
    path.join(consumer, "node_modules/.bin/nozo-commitlint"),
    ["--config", "commitlint.config.ts"],
    { cwd: consumer, input: message, stdio: "pipe" },
  );

  return status;
}
