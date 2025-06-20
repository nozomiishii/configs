import { echo, $ } from 'zx';

/**
 * Setup git
 */
export async function setupGit() {
  echo('Setup git');

  // Gitでファイルの大文字小文字を区別
  await $`git config core.ignorecase false`;

  const result = await $`git config core.ignorecase`;
  echo(`core.ignorecase: ${result.stdout.trim()}`);
}
