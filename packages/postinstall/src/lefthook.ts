import fs from "node:fs";
import { $, echo } from "zx";

const TARGET_FILE = "lefthook-local.yaml";

/**
 * Setup lefthook
 */
export async function setupLefthook() {
  echo("Setup lefthook");

  try {
    await createLocalConfig();

    const result = await $`lefthook install --force`;
    echo(result);
  } catch (error) {
    echo(error);
  }
}

/**
 * Create a local config file
 */
async function createLocalConfig() {
  if (fs.existsSync(TARGET_FILE)) {
    echo(`Skipped: ${TARGET_FILE} already exists.`);

    return;
  }

  await $`touch ${TARGET_FILE}`;
}
