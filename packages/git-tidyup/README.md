# git-tidyup

English | [日本語](./README.ja.md)

Clean up merged branches and worktrees (supports squash merges).

## Usage

```sh
pnpx git-tidyup
```

With npm:

```sh
npx git-tidyup
```

### Options

```sh
git-tidyup --help     # Show help
git-tidyup --version  # Show version
```

## What it does

1. Detects the default branch (main/master) from `origin/HEAD`
2. Finds local branches already merged into the default branch (including squash merges)
3. Removes worktrees associated with merged branches
4. Deletes the merged branches
5. Prunes stale remote-tracking references

### Squash merge detection

Uses `git commit-tree` to create a virtual squash commit and `git cherry` to check if the result is already included in the default branch. This correctly detects squash merges, which `git branch --merged` cannot.

## With lefthook

```yaml
# lefthook.yaml
post-merge:
  commands:
    cleanup-merged:
      run: pnpx git-tidyup
```
