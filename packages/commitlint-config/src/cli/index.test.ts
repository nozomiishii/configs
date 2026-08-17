import { execFileSync, spawnSync, type SpawnSyncReturns } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test, vi } from "vitest";
import { buildCommitlintArgs, resolveSelfConfigPath } from ".";

const packageRoot = fileURLToPath(new URL("../..", import.meta.url));
const binPath = path.join(packageRoot, "bin", "nozo-commitlint.js");

// git repo の位置を決める環境変数。git hook や `git rebase --exec` の下でテストを回すと
// git がこれらを尊重し、一時 repo ではなく周囲の repo を見てしまう。
const gitLocationEnvVars = [
  "GIT_DIR",
  "GIT_WORK_TREE",
  "GIT_INDEX_FILE",
  "GIT_COMMON_DIR",
  "GIT_OBJECT_DIRECTORY",
  "GIT_CEILING_DIRECTORIES",
];

const resolveConfigPath = () => "/abs/config.js";

const throwingResolve = () => {
  throw new Error("resolved without --recommended");
};

type Fixture = {
  /**
   * `--edit` より前に渡す引数。
   */
  args?: string[];
  /**
   * 一時 repo に置く commitlint.config.mjs の中身。省略すると設定を持たない repo になる。
   */
  config?: string;
  message: string;
};

/**
 * 一時 git repo で bin を起動する。
 * package.json も node_modules も置かないので、共有設定が名前解決で見つかることはない。
 * commitlint の `--edit` は git root を要求するため `git init` だけ行う。
 */
function lintInTempRepo({ args = [], config, message }: Fixture): SpawnSyncReturns<string> {
  // 周囲の repo を指す設定を子プロセスへ継承させない。
  for (const name of gitLocationEnvVars) {
    vi.stubEnv(name, undefined);
  }

  const cwd = mkdtempSync(path.join(tmpdir(), "nozo-commitlint-cli-"));

  try {
    execFileSync("git", ["init", "--quiet"], { cwd });

    if (config !== undefined) {
      writeFileSync(path.join(cwd, "commitlint.config.mjs"), config);
    }

    const file = path.join(cwd, "COMMIT_EDITMSG");
    writeFileSync(file, message);

    return spawnSync(process.execPath, [binPath, ...args, "--edit", file, "--verbose"], {
      cwd,
      encoding: "utf-8",
    });
  } finally {
    rmSync(cwd, { force: true, recursive: true });
  }
}

describe("buildCommitlintArgs", () => {
  // flag が無ければ argv に触らない = @commitlint/cli の pass-through のまま。
  test("passes argv through untouched without the flag", () => {
    expect(buildCommitlintArgs(["--edit", "MSG", "--verbose"], resolveConfigPath)).toStrictEqual([
      "--edit",
      "MSG",
      "--verbose",
    ]);
  });

  // flag はその位置で --config に置き換わり、commitlint には渡らない。
  test("replaces the flag in place with an absolute --config", () => {
    expect(buildCommitlintArgs(["--recommended", "--edit", "MSG"], resolveConfigPath)).toStrictEqual(
      ["--config", "/abs/config.js", "--edit", "MSG"],
    );
  });

  // 位置を保つので、後続の --config が yargs の後勝ちで優先される。
  test("keeps a caller-supplied --config after the injected one", () => {
    expect(
      buildCommitlintArgs(["--recommended", "--config", "./mine.ts"], resolveConfigPath),
    ).toStrictEqual(["--config", "/abs/config.js", "--config", "./mine.ts"]);
  });

  // flag が無いときは設定の解決自体を走らせない。
  test("does not resolve the config path without the flag", () => {
    expect(() => buildCommitlintArgs(["--edit", "MSG"], throwingResolve)).not.toThrow();
  });
});

describe("resolveSelfConfigPath", () => {
  // 名前解決を cwd に依存させないため、自分のパッケージ内の絶対パスを指す。
  // 「絶対パスかつ存在する」だけでは npx cache に残った古いコピーも満たしてしまう。
  test("resolves inside this package", () => {
    expect(resolveSelfConfigPath()).toBe(path.join(packageRoot, "dist", "index.js"));
  });
});

// package.json も node_modules も持たない repo での実挙動を固定する。
// unit test が緑でも実行経路が壊れている、という壊れ方をしていたため、
// ここだけは実際に bin を起動して確かめる。
describe("nozo-commitlint --recommended in a repo without package.json or node_modules", () => {
  // type-enum の絞り込みが効く。
  test("rejects a type outside the allow-list", () => {
    const result = lintInTempRepo({
      args: ["--recommended"],
      message: "refactor: reorganize modules\n",
    });

    expect(result.stdout).toContain("type-enum");
    expect(result.status).not.toBe(0);
  });

  // custom rule が登録され、非 ASCII の body を弾く。
  test("rejects a non-ASCII body", () => {
    const result = lintInTempRepo({
      args: ["--recommended"],
      message: "feat: add thing\n\n日本語の本文\n",
    });

    expect(result.stdout).toContain("commit-message-ascii-only");
    expect(result.status).not.toBe(0);
  });

  // 正常なメッセージは通る。
  test("accepts a conforming message", () => {
    const result = lintInTempRepo({
      args: ["--recommended"],
      message: "feat: add thing\n\nEnglish body only.\n",
    });

    expect(result.stdout).toContain("found 0 problems");
    expect(result.status).toBe(0);
  });
});

// flag が無いときは共有設定を勝手に載せない、という契約を固定する。
describe("nozo-commitlint without --recommended", () => {
  // 設定が無い repo では commitlint 本来の「rule が無い」経路 (exit 9) に落ちる。
  test("does not apply the shared config", () => {
    const result = lintInTempRepo({ message: "refactor: reorganize modules\n" });

    expect(result.stdout).not.toContain("type-enum");
    expect(result.status).toBe(9);
  });

  // repo 側の設定が勝つ。共有設定を下敷きに差し込まない。
  test("lets a repo-level config win", () => {
    const result = lintInTempRepo({
      config: 'export default { rules: { "type-enum": [2, "always", ["refactor"]] } };\n',
      message: "refactor: reorganize modules\n",
    });

    expect(result.status).toBe(0);
  });
});
