import { chalk, fs, $, echo } from 'zx';

const TARGET_FILE = 'lefthook-local.yaml';

const info = chalk.bold.bgBlue;
const error = chalk.bold.red;

async function createLocalConfig() {
  if (fs.existsSync(TARGET_FILE)) {
    return echo(`Skipped: ${TARGET_FILE} already exists.`);
  }

  await $`touch ${TARGET_FILE}`;
}

export async function setupLefthook() {
  echo(info('Setup lefthook'));

  try {
    await createLocalConfig();

    const result = await $`lefthook install`;
    echo(result);
  } catch (e) {
    echo(error(e));
  }
}
