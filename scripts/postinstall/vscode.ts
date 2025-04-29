import { chalk, echo, fs, glob, path } from 'zx';

const info = chalk.bold.bgBlue;

/**
 * .vscode/settings.example.jsoncを.vscode/settings.jsonに再帰的に変換
 */
export async function setupVSCode() {
  echo(info('Setup vscode'));

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
