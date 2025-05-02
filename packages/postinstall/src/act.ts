import { fs, echo, path } from 'zx';

const TARGET_FILE = '.actrc';
const EXAMPLE_FILE = '.actrc.example';

/**
 * Setup act
 */
export async function setupAct() {
  echo('Setup act');

  const projectRoot = process.env.INIT_CWD || '.';
  const actrcExamplePath = path.resolve(projectRoot, EXAMPLE_FILE);
  const targetFilePath = path.resolve(projectRoot, TARGET_FILE);

  if (!fs.existsSync(actrcExamplePath)) {
    echo(`Skipped: ${EXAMPLE_FILE} does not exist.`);
    return;
  }

  if (fs.existsSync(targetFilePath)) {
    echo(`Skipped: ${TARGET_FILE} already exists.`);
    return;
  }

  fs.copyFileSync(actrcExamplePath, targetFilePath);
  echo(`Copied: ${actrcExamplePath} -> ${TARGET_FILE}`);
}
