import { echo, $ } from "zx";

/**
 * Setup git
 */
export async function setupGit() {
  echo("Setup git");

  const insideRepo = await $`git rev-parse --is-inside-work-tree`.nothrow().quiet();
  if (insideRepo.exitCode !== 0) {
    echo("Skipped: not inside a git repository.");
    return;
  }

  // Gitでファイルの大文字小文字を区別
  await $`git config core.ignorecase false`;

  const result = await $`git config core.ignorecase`;
  echo(`core.ignorecase: ${result.stdout.trim()}`);
}
