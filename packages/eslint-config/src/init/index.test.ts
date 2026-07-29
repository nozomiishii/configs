import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, test } from "vitest";
import { init, type PresetId, type TsconfigIncludeOutcome } from ".";

type InitResult = {
  configContent: string;
  pkg: {
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
  };
};

type TsconfigInitResult = {
  outcome: TsconfigIncludeOutcome;
  tsconfig: null | string;
};

// 一時dirでinitを実行し、生成された package.json と eslint.config.ts を読み取る
async function runInit(preset?: PresetId, isMonorepo?: boolean): Promise<InitResult> {
  const tmpDir = mkdtempSync(path.join(tmpdir(), "nozo-eslint-init-"));
  writeFileSync(
    path.join(tmpDir, "package.json"),
    `${JSON.stringify({ name: "fixture", version: "1.0.0" }, null, 2)}\n`,
  );

  await init({
    cwd: tmpDir,
    ...(isMonorepo !== undefined && { monorepo: isMonorepo }),
    ...(preset !== undefined && { preset }),
  });

  const pkg = JSON.parse(
    readFileSync(path.join(tmpDir, "package.json"), "utf8"),
  ) as InitResult["pkg"];
  const configContent = readFileSync(path.join(tmpDir, "eslint.config.ts"), "utf8");

  rmSync(tmpDir, { force: true, recursive: true });

  return { configContent, pkg };
}

// tsconfig.json を任意で置いた一時dirでinitを実行し、戻り値と書き戻された tsconfig.json を読み取る
async function runInitWithTsconfig(tsconfigSource?: string): Promise<TsconfigInitResult> {
  const tmpDir = mkdtempSync(path.join(tmpdir(), "nozo-eslint-init-"));
  writeFileSync(
    path.join(tmpDir, "package.json"),
    `${JSON.stringify({ name: "fixture", version: "1.0.0" }, null, 2)}\n`,
  );

  const tsconfigPath = path.join(tmpDir, "tsconfig.json");

  if (tsconfigSource !== undefined) {
    writeFileSync(tsconfigPath, tsconfigSource);
  }

  const { tsconfigInclude } = await init({ cwd: tmpDir });
  const tsconfig = existsSync(tsconfigPath) ? readFileSync(tsconfigPath, "utf8") : null;

  rmSync(tmpDir, { force: true, recursive: true });

  return { outcome: tsconfigInclude, tsconfig };
}

test("init adds @nozomiishii/eslint-config to devDependencies", async () => {
  const { pkg } = await runInit();

  expect(pkg.devDependencies?.["@nozomiishii/eslint-config"]).toMatch(/^\d+\.\d+\.\d+$/);
});

test("init adds eslint to devDependencies", async () => {
  const { pkg } = await runInit();

  expect(pkg.devDependencies?.eslint).toMatch(/^\d+\.\d+\.\d+$/);
});

test("init adds typescript to devDependencies", async () => {
  const { pkg } = await runInit();

  expect(pkg.devDependencies?.typescript).toMatch(/^\d+\.\d+\.\d+$/);
});

test("init adds eslint script", async () => {
  const { pkg } = await runInit();

  expect(pkg.scripts?.eslint).toBe("eslint --max-warnings=0 --cache");
});

test("init adds lint script", async () => {
  const { pkg } = await runInit();

  expect(pkg.scripts?.lint).toBe("pnpm eslint");
});

test("init adds lint:fix script", async () => {
  const { pkg } = await runInit();

  expect(pkg.scripts?.["lint:fix"]).toBe("pnpm eslint --fix");
});

// preset 未指定は nextjs starter を書き出す
test("init defaults to the nextjs preset", async () => {
  const { configContent } = await runInit();

  expect(configContent).toContain("nextjs");
});

// 既定の starter は node bundle を使わない
test("the default starter does not use the node bundle", async () => {
  const { configContent } = await runInit();

  expect(configContent).not.toContain("...node()");
});

// preset=node は node bundle を書き出す
test("init with the node preset writes the node bundle", async () => {
  const { configContent } = await runInit("node");

  expect(configContent).toContain("...node()");
});

// node starter は nextjs を参照しない
test("the node starter does not reference nextjs", async () => {
  const { configContent } = await runInit("node");

  expect(configContent).not.toContain("nextjs");
});

// monorepo を選ぶと tsconfigRootDir を渡す形で書き出す
test("init with monorepo writes tsconfigRootDir", async () => {
  const { configContent } = await runInit("node", true);

  expect(configContent).toContain("node({ typescript: { tsconfigRootDir: import.meta.dirname } })");
});

// 単一 repo (既定) は tsconfigRootDir を入れない
test("init without monorepo omits tsconfigRootDir", async () => {
  const { configContent } = await runInit("node");

  expect(configContent).not.toContain("tsconfigRootDir");
});

// preset は .storybook を lint するため、tsconfig の include にも glob を足す
test("init adds the storybook glob to the tsconfig include", async () => {
  const { tsconfig } = await runInitWithTsconfig(`{\n  "include": ["src"]\n}\n`);

  expect(tsconfig).toContain('".storybook/**/*"');
});

test("init reports added when it writes the storybook glob", async () => {
  const { outcome } = await runInitWithTsconfig(`{\n  "include": ["src"]\n}\n`);

  expect(outcome).toBe("added");
});

// 1行で書かれた include は1行のまま保つ
test("init keeps a single-line include on one line", async () => {
  const { tsconfig } = await runInitWithTsconfig(`{ "include": ["src"] }\n`);

  expect(tsconfig).toBe(`{ "include": ["src", ".storybook/**/*"] }\n`);
});

// 複数行で書かれた include は既存要素のインデントに合わせる
test("init matches the indentation of a multi-line include", async () => {
  const { tsconfig } = await runInitWithTsconfig(`{\n  "include": [\n    "src"\n  ]\n}\n`);

  expect(tsconfig).toBe(`{\n  "include": [\n    "src",\n    ".storybook/**/*"\n  ]\n}\n`);
});

// 既に glob があれば tsconfig.json は書き換えない
test("init leaves the tsconfig untouched when the storybook glob is present", async () => {
  const source = `{\n  "include": ["src", ".storybook/**/*"]\n}\n`;

  const { tsconfig } = await runInitWithTsconfig(source);

  expect(tsconfig).toBe(source);
});

test("init reports unchanged when the storybook glob is present", async () => {
  const { outcome } = await runInitWithTsconfig(`{\n  "include": [".storybook/**/*"]\n}\n`);

  expect(outcome).toBe("unchanged");
});

// コメント付き tsconfig.json のコメントを消さない
test("init preserves comments in the tsconfig", async () => {
  const { tsconfig } = await runInitWithTsconfig(`{\n  // src only\n  "include": ["src"]\n}\n`);

  expect(tsconfig).toContain("// src only");
});

// コメント付きでも glob は足せる
test("init adds the storybook glob to a tsconfig with comments", async () => {
  const { tsconfig } = await runInitWithTsconfig(`{\n  // src only\n  "include": ["src"]\n}\n`);

  expect(tsconfig).toContain('".storybook/**/*"');
});

// tsconfig.json が無いプロジェクトには作らない
test("init does not create a tsconfig.json", async () => {
  const { tsconfig } = await runInitWithTsconfig();

  expect(tsconfig).toBeNull();
});

test("init reports missing when the project has no tsconfig.json", async () => {
  const { outcome } = await runInitWithTsconfig();

  expect(outcome).toBe("missing");
});

// include の無い tsconfig は既定の **/* を壊さないよう触らない
test("init leaves a tsconfig without include untouched", async () => {
  const source = `{\n  "compilerOptions": { "strict": true }\n}\n`;

  const { tsconfig } = await runInitWithTsconfig(source);

  expect(tsconfig).toBe(source);
});

test("init reports no-include when the tsconfig has no include array", async () => {
  const { outcome } = await runInitWithTsconfig(`{\n  "compilerOptions": {}\n}\n`);

  expect(outcome).toBe("no-include");
});

// 壊れた tsconfig.json でも init 全体は失敗させない
test("init reports invalid when the tsconfig cannot be parsed", async () => {
  const { outcome } = await runInitWithTsconfig(`{ "include": [`);

  expect(outcome).toBe("invalid");
});
