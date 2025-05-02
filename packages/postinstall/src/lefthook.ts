import { fs, $, echo } from 'zx';

const TARGET_FILE = 'lefthook-local.yaml';

/**
 * Create a local config file
 */
async function createLocalConfig() {
  if (fs.existsSync(TARGET_FILE)) {
    return echo(`Skipped: ${TARGET_FILE} already exists.`);
  }

  await $`touch ${TARGET_FILE}`;
}

/**
 * Setup lefthook
 */
export async function setupLefthook() {
  echo('Setup lefthook');

  try {
    await createLocalConfig();

    const result = await $`lefthook install`;
    echo(result);
  } catch (e) {
    echo(e);
  }
}
