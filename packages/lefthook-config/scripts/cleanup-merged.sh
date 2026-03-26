#!/usr/bin/env bash
set -euo pipefail

# リモートのデフォルトブランチ名を取得する (例: main, master)
# 未設定の場合はリモートから自動取得を試みる
default_branch() {
  local branch
  branch=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's|refs/remotes/origin/||')

  # 未設定の場合、リモートに問い合わせて自動設定
  if [ -z "$branch" ]; then
    git remote set-head origin --auto >/dev/null 2>&1
    branch=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's|refs/remotes/origin/||')
  fi

  if [ -z "$branch" ]; then
    echo "Could not determine default branch" >&2
    exit 1
  fi

  echo "$branch"
}

# マージ済みブランチに紐づく worktree を削除する
cleanup_worktrees() {
  local base="$1"
  local merged_branches="$2"

  # 全 worktree のパスを取得してループ
  while read -r wt; do
    # その worktree が指しているブランチ名を取得
    branch=$(git -C "$wt" rev-parse --abbrev-ref HEAD 2>/dev/null) || continue
    [ "$branch" = "$base" ] && continue
    if echo "$merged_branches" | grep -qw "$branch"; then
      git worktree remove "$wt" && echo "Removed worktree: $wt"
    fi
  done < <(git worktree list --porcelain | grep '^worktree ' | sed 's/^worktree //')
  # 既に存在しない worktree の管理情報を削除
  git worktree prune
}

# マージ済みローカルブランチを削除する
cleanup_branches() {
  local base="$1"
  local merged_branches="$2"

  while read -r branch; do
    [ -z "$branch" ] && continue
    [ "$branch" = "$base" ] && continue
    git branch -D "$branch" 2>/dev/null && echo "Deleted branch: $branch"
  done <<< "$merged_branches"
  # リモートで削除済みの追跡ブランチを整理
  git fetch --prune || true
}

main() {
  local base
  base=$(default_branch)

  # デフォルトブランチにマージ済みのローカルブランチ一覧を取得
  # git branch --merged は squash merge を検出できないため、
  # commit-tree で仮想 squash コミットを作成し git cherry で比較する
  local merged_branches
  merged_branches=$(
    while read -r branch; do
      [ "$branch" = "$base" ] && continue
      local merge_base
      merge_base=$(git merge-base "$base" "$branch" 2>/dev/null) || continue
      # ブランチの tree を使い、merge-base を親に持つ仮想 squash コミットを作成
      local squash_commit
      squash_commit=$(git commit-tree "$branch^{tree}" -p "$merge_base" -m "_" 2>/dev/null) || continue
      # 仮想 squash コミットが base に既に含まれていれば "-" を返す
      if [ "$(git cherry "$base" "$squash_commit" 2>/dev/null | grep -c '^+')" -eq 0 ]; then
        echo "$branch"
      fi
    done < <(git branch | sed 's/^[* ]*//')
  )

  [ -z "$merged_branches" ] && exit 0

  # worktree が参照中のブランチは削除できないため、worktree を先に削除する
  cleanup_worktrees "$base" "$merged_branches"
  cleanup_branches "$base" "$merged_branches"
}

main
