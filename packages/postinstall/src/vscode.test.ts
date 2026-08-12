import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, test } from "vitest";
import { setupVSCode } from "./vscode";

type ExampleFile = "settings.example.json" | "settings.example.jsonc";

async function runSetup({
  examples,
  settings,
}: {
  examples: Partial<Record<ExampleFile, string>>;
  settings?: string;
}) {
  const originalCwd = process.cwd();
  const tmpDir = mkdtempSync(path.join(tmpdir(), "nozo-postinstall-vscode-"));
  const vscodeDir = path.join(tmpDir, ".vscode");
  const settingsPath = path.join(vscodeDir, "settings.json");
  mkdirSync(vscodeDir);

  for (const [file, contents] of Object.entries(examples)) {
    writeFileSync(path.join(vscodeDir, file), contents);
  }

  if (settings !== undefined) {
    writeFileSync(settingsPath, settings);
  }

  try {
    process.chdir(tmpDir);
    await setupVSCode();

    return existsSync(settingsPath) ? readFileSync(settingsPath, "utf-8") : undefined;
  } finally {
    process.chdir(originalCwd);
    rmSync(tmpDir, { force: true, recursive: true });
  }
}

// .json example から settings.json を生成する。
test("copies settings.example.json to settings.json", async () => {
  const contents = '{"editor.formatOnSave":true}\n';

  expect(
    await runSetup({ examples: { "settings.example.json": contents } }),
  ).toBe(contents);
});

// 従来の .jsonc example からも settings.json を生成する。
test("copies settings.example.jsonc to settings.json", async () => {
  const contents = '{\n  // Keep JSONC comments.\n  "editor.formatOnSave": true,\n}\n';

  expect(
    await runSetup({ examples: { "settings.example.jsonc": contents } }),
  ).toBe(contents);
});

// 既存の settings.json は example で上書きしない。
test("preserves an existing settings.json", async () => {
  const settings = '{"existing":true}\n';

  expect(
    await runSetup({
      examples: {
        "settings.example.json": '{"fromJson":true}\n',
        "settings.example.jsonc": '{"fromJsonc":true}\n',
      },
      settings,
    }),
  ).toBe(settings);
});

// 両方の example がある場合は strict JSON の .json を優先する。
test("prefers settings.example.json when both examples exist", async () => {
  const jsonContents = '{"fromJson":true}\n';

  expect(
    await runSetup({
      examples: {
        "settings.example.json": jsonContents,
        "settings.example.jsonc": '{"fromJsonc":true}\n',
      },
    }),
  ).toBe(jsonContents);
});
