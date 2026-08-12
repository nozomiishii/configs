import fs from "node:fs";
import path from "node:path";
import { echo, glob } from "zx";

/**
 * Recursively copy a .vscode/settings example to .vscode/settings.json.
 * Prefer strict JSON when both example formats exist.
 */
export async function setupVSCode() {
  echo("Setup vscode");

  const examples = await glob([
    "**/.vscode/settings.example.json",
    "**/.vscode/settings.example.jsonc",
  ]);

  for (const example of examples) {
    const file = path.join(path.dirname(example), "settings.json");

    if (fs.existsSync(file)) {
      echo(`Skipped: ${file} already exists.`);

      continue;
    }

    fs.copyFileSync(example, file);
    echo(`Copied: ${example} -> ${file}`);
  }
}
