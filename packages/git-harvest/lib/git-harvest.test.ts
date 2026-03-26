import { execSync } from 'child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { afterEach, beforeEach, describe, expect, test } from 'bun:test';

const SCRIPT = join(import.meta.dir, 'git-harvest.sh');

// ヘルパー: スクリプト実行
function run(cwd: string, args = ''): string {
  return execSync(`bash ${SCRIPT} ${args}`, {
    cwd,
    encoding: 'utf-8',
    stdio: 'pipe',
  });
}

// ヘルパー: スクリプト実行（失敗を期待）
function runExpectFail(cwd: string, args = ''): { status: number; stderr: string } {
  try {
    execSync(`bash ${SCRIPT} ${args}`, { cwd, encoding: 'utf-8', stdio: 'pipe' });
    return { status: 0, stderr: '' };
  } catch (e: unknown) {
    const err = e as { status: number; stderr: string };
    return { status: err.status, stderr: err.stderr };
  }
}

// ヘルパー: ブランチ一覧を取得
function branches(cwd: string): string[] {
  return execSync('git branch', { cwd, encoding: 'utf-8' })
    .split('\n')
    .map((b) => b.replace(/^[*+ ]+/, '').trim())
    .filter(Boolean);
}

// ヘルパー: git コマンド実行
function git(cwd: string, args: string): string {
  return execSync(`git ${args}`, { cwd, encoding: 'utf-8', stdio: 'pipe' });
}

// ヘルパー: ファイルを作成してコミット
function commitFile(cwd: string, filename: string, message: string): void {
  writeFileSync(join(cwd, filename), `${filename}: ${message}\n`);
  git(cwd, `add ${filename}`);
  git(cwd, `commit -m "${message}"`);
}

// ヘルパー: worktree 一覧を取得
function worktrees(cwd: string): string[] {
  return execSync('git worktree list --porcelain', { cwd, encoding: 'utf-8' })
    .split('\n')
    .filter((l) => l.startsWith('worktree '))
    .map((l) => l.replace('worktree ', ''));
}

let bare: string;
let repo: string;

// テストごとに origin 付きリポジトリを作成
beforeEach(() => {
  bare = mkdtempSync(join(tmpdir(), 'git-harvest-bare-'));
  execSync(`git init --bare ${bare}`);
  repo = mkdtempSync(join(tmpdir(), 'git-harvest-work-'));
  execSync(`git clone ${bare} ${repo}`);
  git(repo, 'config user.email "test@test.com"');
  git(repo, 'config user.name "Test"');
  commitFile(repo, 'README.md', 'init');
  git(repo, 'push');
});

afterEach(() => {
  // worktree は repo 外のディレクトリに作られるため、repo の rmSync では削除されない。先に除去する。
  try {
    const wts = worktrees(repo);
    for (const wt of wts) {
      if (wt !== repo) {
        try {
          git(repo, `worktree remove --force ${wt}`);
        } catch {
          // ignore
        }
      }
    }
  } catch {
    // ignore
  }
  rmSync(bare, { recursive: true, force: true });
  rmSync(repo, { recursive: true, force: true });
});

describe('--help / --version', () => {
  // ヘルプ表示
  test('prints help and exits with 0', () => {
    const output = run(repo, '--help');
    expect(output).toContain('Usage: git-harvest');
    expect(output).toContain('--help');
    expect(output).toContain('--version');
  });

  // バージョン表示
  test('prints version and exits with 0', () => {
    const output = run(repo, '--version');
    expect(output).toMatch(/^git-harvest v\d+\.\d+\.\d+/);
  });
});

describe('default_branch', () => {
  // origin/HEAD 設定済み
  test('resolves default branch from origin/HEAD', () => {
    run(repo);
  });

  // origin/HEAD 未設定 → 自動復旧
  test('recovers via set-head --auto when origin/HEAD is unset', () => {
    git(repo, 'remote set-head origin -d');
    run(repo);
  });

  // remote なし → 異常終了
  test('exits with 1 when no remote is configured', () => {
    const noRemoteRepo = mkdtempSync(join(tmpdir(), 'git-harvest-noremote-'));
    try {
      execSync(`git init ${noRemoteRepo}`);
      git(noRemoteRepo, 'config user.email "test@test.com"');
      git(noRemoteRepo, 'config user.name "Test"');
      git(noRemoteRepo, 'commit --allow-empty -m "init"');

      const result = runExpectFail(noRemoteRepo);
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain('Could not determine default branch');
    } finally {
      rmSync(noRemoteRepo, { recursive: true, force: true });
    }
  });
});

describe('merge detection', () => {
  // 通常マージ済み
  test('detects and deletes regular merged branches', () => {
    git(repo, 'checkout -b feature-regular');
    commitFile(repo, 'feature-regular.txt', 'feature work');
    git(repo, 'checkout main');
    git(repo, "merge feature-regular --no-ff -m 'merge feature'");
    git(repo, 'push');

    run(repo);
    expect(branches(repo)).not.toContain('feature-regular');
    expect(branches(repo)).toContain('main');
  });

  // squash マージ済み
  test('detects and deletes squash-merged branches', () => {
    git(repo, 'checkout -b feature-squash');
    commitFile(repo, 'squash1.txt', 'squash work 1');
    commitFile(repo, 'squash2.txt', 'squash work 2');
    git(repo, 'checkout main');
    git(repo, 'merge --squash feature-squash');
    git(repo, 'commit -m "squash merge feature"');
    git(repo, 'push');

    run(repo);
    expect(branches(repo)).not.toContain('feature-squash');
    expect(branches(repo)).toContain('main');
  });

  // 未マージは保持
  test('preserves unmerged branches', () => {
    git(repo, 'checkout -b feature-wip');
    commitFile(repo, 'wip.txt', 'wip');
    git(repo, 'checkout main');

    run(repo);
    expect(branches(repo)).toContain('feature-wip');
  });

  // マージ済みなし → 何もしない
  test('exits with 0 when no merged branches exist', () => {
    run(repo);
    expect(branches(repo)).toEqual(['main']);
  });

  // 孤立ブランチはスキップ
  test('skips orphan branches without common ancestor', () => {
    git(repo, 'checkout --orphan isolated');
    commitFile(repo, 'orphan.txt', 'orphan commit');
    git(repo, 'checkout main');

    run(repo);
    expect(branches(repo)).toContain('isolated');
  });
});

describe('worktree cleanup', () => {
  // マージ済み worktree を削除
  test('removes worktrees for merged branches', () => {
    git(repo, 'checkout -b wt-merged');
    commitFile(repo, 'wt-merged.txt', 'wt work');
    git(repo, 'checkout main');
    git(repo, 'merge --squash wt-merged');
    git(repo, 'commit -m "squash merge wt"');
    git(repo, 'push');

    const wtDir = join(repo, '..', 'wt-merged-dir');
    git(repo, `worktree add ${wtDir} wt-merged`);
    expect(worktrees(repo).length).toBeGreaterThan(1);

    run(repo);
    expect(branches(repo)).not.toContain('wt-merged');
    expect(worktrees(repo)).toHaveLength(1);
  });

  // default branch の worktree は保持
  test('preserves worktree on default branch', () => {
    // main の worktree を追加するため、まず別ブランチに退避
    git(repo, 'checkout -b temp-branch');
    const wtDir = join(repo, '..', 'wt-main-dir');
    git(repo, `worktree add ${wtDir} main`);

    // temp-branch から実行（main は worktree にいる）
    const wtCountBefore = worktrees(repo).length;
    run(repo);
    expect(worktrees(repo).length).toBe(wtCountBefore);

    // cleanup
    git(repo, `worktree remove ${wtDir}`);
  });

  // 未マージ worktree は保持
  test('preserves worktrees for unmerged branches', () => {
    git(repo, 'checkout -b wt-unmerged');
    commitFile(repo, 'wt-unmerged.txt', 'unmerged work');
    git(repo, 'checkout main');

    const wtDir = join(repo, '..', 'wt-unmerged-dir');
    git(repo, `worktree add ${wtDir} wt-unmerged`);

    run(repo);
    expect(branches(repo)).toContain('wt-unmerged');
    expect(worktrees(repo).length).toBeGreaterThan(1);

    // cleanup
    git(repo, `worktree remove ${wtDir}`);
  });

  // worktree なし → 正常通過
  test('succeeds when no worktrees exist', () => {
    git(repo, 'checkout -b feature-no-wt');
    commitFile(repo, 'no-wt.txt', 'work');
    git(repo, 'checkout main');
    git(repo, 'merge --squash feature-no-wt');
    git(repo, 'commit -m "squash"');
    git(repo, 'push');

    run(repo);
    expect(branches(repo)).not.toContain('feature-no-wt');
  });

  // 手動削除済み worktree を prune
  test('prunes manually deleted worktree entries', () => {
    git(repo, 'checkout -b wt-prune');
    commitFile(repo, 'wt-prune.txt', 'prune work');
    git(repo, 'checkout main');

    const wtDir = mkdtempSync(join(tmpdir(), 'git-harvest-wt-prune-'));
    git(repo, `worktree add ${wtDir} wt-prune`);

    // worktree ディレクトリを手動で削除（git worktree remove ではなく）
    rmSync(wtDir, { recursive: true, force: true });

    run(repo);
    // prune 後は stale エントリが消えている（wt-prune ブランチは未マージなので残る）
    expect(branches(repo)).toContain('wt-prune');
  });
});

describe('combined scenarios', () => {
  // worktree + ブランチ両方削除
  test('removes both worktree and branch for merged work', () => {
    git(repo, 'checkout -b combo-merged');
    commitFile(repo, 'combo.txt', 'combo work');
    git(repo, 'checkout main');
    git(repo, 'merge --squash combo-merged');
    git(repo, 'commit -m "squash combo"');
    git(repo, 'push');

    const wtDir = join(repo, '..', 'combo-wt-dir');
    git(repo, `worktree add ${wtDir} combo-merged`);

    run(repo);
    expect(branches(repo)).not.toContain('combo-merged');
    expect(worktrees(repo)).toHaveLength(1);
  });

  // マージ済みと未マージの混在
  test('deletes only merged branches when mixed with unmerged', () => {
    git(repo, 'checkout -b merged-one');
    commitFile(repo, 'merged.txt', 'merged work');
    git(repo, 'checkout main');
    git(repo, 'merge --squash merged-one');
    git(repo, 'commit -m "squash one"');
    git(repo, 'push');

    git(repo, 'checkout -b unmerged-one');
    commitFile(repo, 'unmerged.txt', 'unmerged work');
    git(repo, 'checkout main');

    run(repo);
    expect(branches(repo)).not.toContain('merged-one');
    expect(branches(repo)).toContain('unmerged-one');
  });

  // master がデフォルトブランチ
  test('works when default branch is master', () => {
    const masterBare = mkdtempSync(join(tmpdir(), 'git-harvest-master-bare-'));
    const masterRepo = mkdtempSync(join(tmpdir(), 'git-harvest-master-work-'));
    try {
      execSync(`git init --bare -b master ${masterBare}`);
      execSync(`git clone ${masterBare} ${masterRepo}`);
      git(masterRepo, 'config user.email "test@test.com"');
      git(masterRepo, 'config user.name "Test"');
      commitFile(masterRepo, 'README.md', 'init');
      git(masterRepo, 'push -u origin master');

      git(masterRepo, 'checkout -b feature-on-master');
      commitFile(masterRepo, 'feature.txt', 'feature');
      git(masterRepo, 'checkout master');
      git(masterRepo, 'merge --squash feature-on-master');
      git(masterRepo, 'commit -m "squash"');
      git(masterRepo, 'push');

      run(masterRepo);
      expect(branches(masterRepo)).not.toContain('feature-on-master');
      expect(branches(masterRepo)).toContain('master');
    } finally {
      rmSync(masterBare, { recursive: true, force: true });
      rmSync(masterRepo, { recursive: true, force: true });
    }
  });

  // exit code 0
  test('exits with 0 on successful cleanup', () => {
    git(repo, 'checkout -b to-clean');
    commitFile(repo, 'clean.txt', 'clean me');
    git(repo, 'checkout main');
    git(repo, 'merge --squash to-clean');
    git(repo, 'commit -m "squash clean"');
    git(repo, 'push');

    // run() は execSync なので失敗したら throw される
    // 正常に返ることが exit 0 の証明
    run(repo);
  });
});
