import fs from "node:fs";
import path from "node:path";
import { env } from "node:process";
import { echo } from "zx";

const TARGET_FILE = ".actrc";
const EXAMPLE_FILE = ".actrc.example";

/**
 * Setup act
 */
export function setupAct() {
  echo("Setup act");

  const projectRoot = env.INIT_CWD ?? ".";
  const actrcExamplePath = path.resolve(projectRoot, EXAMPLE_FILE);

  if (!fs.existsSync(actrcExamplePath)) {
    echo(`Skipped: ${EXAMPLE_FILE} does not exist.`);

    return;
  }

  const targetFilePath = path.resolve(projectRoot, TARGET_FILE);

  if (fs.existsSync(targetFilePath)) {
    echo(`Skipped: ${TARGET_FILE} already exists.`);

    return;
  }

  fs.copyFileSync(actrcExamplePath, targetFilePath);
  echo(`Copied: ${actrcExamplePath} -> ${TARGET_FILE}`);
}
