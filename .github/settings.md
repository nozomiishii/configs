# .github

## Repo Settings

- [GitHub CLI api](https://cli.github.com/manual/gh_api)
  - [Update a repository](https://docs.github.com/en/rest/repos/repos#update-a-repository)

### 現在の情報の確認

```shell

gh api \
  --method GET \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/nozomiishii/configs
```

### 更新

`-F`: typed parameter  
`-f`: string parameter

```shell
gh api \
  --method PATCH \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/nozomiishii/configs \
  -F delete_branch_on_merge=true \
  -F allow_squash_merge=true \
  -F allow_merge_commit=false \
  -F allow_rebase_merge=false \
  -F allow_auto_merge=true \
  -F use_squash_pr_title_as_default=true \
  -F squash_merge_commit_message="COMMIT_MESSAGES" \
  -F squash_merge_commit_title="PR_TITLE"
```

settings > actionsの次の設定をonにすること

```txt
Allow GitHub Actions to create and approve pull requests
```

## [release-please](https://github.com/googleapis/release-please)設定

- プロジェクト内の名前とversionの確認

```shell
for dir in packages/* apps/nozo/*; do
  if [ -f "$dir/package.json" ]; then
    echo "Project: $dir"
    grep '"name"\|"version"' $dir/package.json
  fi
done
```

- プロジェクトの途中からrelease-please入れるにあたって`release-please-config.json`にbootstrap-shaで基準のcommit hash入れないとgithubのrate limitに引っかかって死ぬので注意

```json
{
  "bootstrap-sha": "6eab9dc5dfb54eea8cefec0b30c6893e06a736f8"
}
```

### release-please-config.json

```jsonc
{
  "packages/eslint-config": {
    "release-type": "node",
    // tagの名前　@nozomiishii/eslint-config-v0.0.0ってなる
    "component": "@nozomiishii/eslint-config",
    // github releaseの名前。package.jsonのname見てくれてる気配
    // "package-name": "@nozomiishii/eslint-config"
  },
}
```
