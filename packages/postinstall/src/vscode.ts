import { echo, fs, glob, path } from 'zx';

/**
 * Recursively convert .vscode/settings.example.jsonc to .vscode/settings.json
 */
export async function setupVSCode() {
  echo('Setup vscode');

  const examples = await glob(['**/.vscode/settings.example.jsonc']);

  for (const example of examples) {
    const file = path.join(path.dirname(example), 'settings.json');

    if (fs.existsSync(file)) {
      echo(`Skipped: ${file} already exists.`);

      continue;
    }

    fs.copyFileSync(example, file);
    echo(`Copied: ${example} -> ${file}`);
  }
}
