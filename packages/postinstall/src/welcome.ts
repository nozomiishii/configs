import figlet from 'figlet';
import { echo } from 'zx';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Convert text to ASCII art
 */
function createAsciiArt(text: string) {
  return figlet.textSync(text, {
    font: 'ANSI Shadow',
  });
}

/**
 * Display a welcome message
 */
export async function welcome() {
  try {
    // Get workspace root package.json path using INIT_CWD
    // INIT_CWD contains the directory where the command (e.g., pnpm install) was originally run.
    // See: https://docs.npmjs.com/cli/v10/using-npm/scripts#environment
    const projectRoot = process.env.INIT_CWD || '.';
    const packageJsonPath = path.resolve(projectRoot, 'package.json');

    // Read and parse package.json
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
    const { name } = JSON.parse(packageJsonContent);

    // Don't display anything if package name is missing
    if (!name) {
      return;
    }

    // For scoped packages (e.g., @scope/name)
    if (name.includes('/')) {
      const [scope, namePart] = name.split('/');
      echo(`${scope}/`);
      echo(createAsciiArt(namePart));
      return;
    }

    // For non-scoped packages
    echo(createAsciiArt(name));
  } catch (error) {
    console.error('Failed to display welcome message:', error);
  }
}
