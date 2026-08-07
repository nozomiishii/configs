import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";
import { init } from ".";

type InitResult = {
  configContent: string;
  fileInfo: { ignored: boolean; inferredParser: null | string };
  ignoreContent: string;
  pkg: {
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
    type?: string;
  };
};

// 一時dirでinitを実行し、生成された package.json と prettier.config.ts を読み取る。
async function runInit(prettierIgnore?: string): Promise<InitResult> {
  const tmpDir = mkdtempSync(path.join(tmpdir(), "nozo-prettier-init-"));
  writeFileSync(
    path.join(tmpDir, "package.json"),
    `${JSON.stringify({ name: "fixture", version: "1.0.0" }, null, 2)}\n`,
  );

  if (prettierIgnore !== undefined) {
    writeFileSync(path.join(tmpDir, ".prettierignore"), prettierIgnore);
  }

  try {
    await init({ cwd: tmpDir });

    const routeTreeRelativePath = "src/routeTree.gen.ts";
    const routeTreePath = path.join(tmpDir, routeTreeRelativePath);
    mkdirSync(path.dirname(routeTreePath));
    writeFileSync(routeTreePath, "export const routeTree = {}\n");
    const scopePath = path.join(tmpDir, "node_modules", "@nozomiishii");
    mkdirSync(scopePath, { recursive: true });
    symlinkSync(
      fileURLToPath(new URL("../..", import.meta.url)),
      path.join(scopePath, "prettier-config"),
      "dir",
    );

    const pkg = JSON.parse(
      readFileSync(path.join(tmpDir, "package.json"), "utf-8"),
    ) as InitResult["pkg"];
    const configContent = readFileSync(path.join(tmpDir, "prettier.config.ts"), "utf-8");
    const ignoreContent = readFileSync(path.join(tmpDir, ".prettierignore"), "utf-8");
    const prettierBin = fileURLToPath(import.meta.resolve("prettier/bin/prettier.cjs"));
    const fileInfo = JSON.parse(
      execFileSync(process.execPath, [prettierBin, "--file-info", routeTreeRelativePath], {
        cwd: tmpDir,
        encoding: "utf-8",
      }),
    ) as InitResult["fileInfo"];

    return { configContent, fileInfo, ignoreContent, pkg };
  } finally {
    rmSync(tmpDir, { force: true, recursive: true });
  }
}

// init は type:module を設定する。
test("init sets type:module", async () => {
  const { pkg } = await runInit();

  expect(pkg.type).toBe("module");
});

// init は @nozomiishii/prettier-config を devDependencies に追加する。
test("init adds @nozomiishii/prettier-config to devDependencies", async () => {
  const { pkg } = await runInit();

  expect(pkg.devDependencies?.["@nozomiishii/prettier-config"]).toMatch(/^\d+\.\d+\.\d+$/);
});

// init は prettier を devDependencies に追加する。
test("init adds prettier to devDependencies", async () => {
  const { pkg } = await runInit();

  expect(pkg.devDependencies?.prettier).toMatch(/^\d+\.\d+\.\d+$/);
});

// init は format script を追加する。
test("init adds format script", async () => {
  const { pkg } = await runInit();

  expect(pkg.scripts?.format).toBe("pnpm prettier . --check");
});

// init は format:fix script を追加する。
test("init adds format:fix script", async () => {
  const { pkg } = await runInit();

  expect(pkg.scripts?.["format:fix"]).toBe("pnpm prettier . --write");
});

// init は prettier script を追加する。
test("init adds prettier script", async () => {
  const { pkg } = await runInit();

  expect(pkg.scripts?.prettier).toBe("prettier --ignore-unknown --cache");
});

// init は prettier.config.ts を生成する。
test("init generates prettier.config.ts", async () => {
  const { configContent } = await runInit();

  expect(configContent.length).toBeGreaterThan(0);
});

// Prettier configにはignore設定が無いため、標準のignore fileへ生成物を追加する。
test("init adds the generated TanStack Router route tree to .prettierignore", async () => {
  const { ignoreContent } = await runInit();

  expect(ignoreContent).toBe("**/routeTree.gen.ts\n");
});

// 既存のignore patternを壊さず、改行が無いファイルにも追記する。
test("init preserves existing .prettierignore patterns", async () => {
  const { ignoreContent } = await runInit("dist");

  expect(ignoreContent).toBe("dist\n**/routeTree.gen.ts\n");
});

// 再実行しても既存のpatternを重複させない。
test("init does not duplicate the route tree ignore pattern", async () => {
  const { ignoreContent } = await runInit("**/routeTree.gen.ts\n");

  expect(ignoreContent).toBe("**/routeTree.gen.ts\n");
});

// consumerと同じPrettier CLIのfile-infoで、設定上のskipではなく実際のignoreを確認する。
test("prettier --file-info reports routeTree.gen.ts as ignored", async () => {
  const { fileInfo } = await runInit();

  expect(fileInfo).toStrictEqual({ ignored: true, inferredParser: null });
});
