# .github

## Repo Settings

```shell
# https://docs.github.com/en/rest/repos/repos#update-a-repository
# 
# GitHub CLI api
# https://cli.github.com/manual/gh_api

gh api \
  --method PATCH \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/<owner>/<repo> \
  -F delete_branch_on_merge=true \
  -F allow_squash_merge=true \
  -F allow_merge_commit=false \
  -F allow_rebase_merge=false
  # -f description='' \
```

`-F`: typed parameter  
`-f`: string parameter  
