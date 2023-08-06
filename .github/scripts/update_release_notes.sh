#!/bin/bash

# -C          : Prevent overwriting files with output redirection
# -e          : Exit the script if any command returns a non-zero status
# -u          : Exit the script if an undefined variable is used
# -o pipefail : Change pipeline exit status to the last non-zero exit
#               code in the pipeline, or zero if all commands succeed
# -x          : (Optional) Enable command tracing for easier debugging
set -euo pipefail

# ----------------------------------------------------------------
# Debug - run: bash ./.github/scripts/update_release_notes.sh
# ----------------------------------------------------------------
# export RELEASE_DATA='{
#   "releases_created": "true",
#   "release_created": "true",
#   "id": "115376899",
#   "name": "v0.12.0",
#   "tag_name": "v0.12.0",
#   "draft": "false",
#   "path": ".",
#   "version": "0.12.0",
#   "apps/backend--release_created": "true",
#   "apps/backend--id": "115376901",
#   "apps/backend--name": "@nozomiishii/backend: v0.9.0",
#   "apps/backend--tag_name": "@nozomiishii/backend-v0.9.0",
#   "apps/backend--draft": "false",
#   "apps/backend--path": "apps/backend",
#   "apps/backend--version": "0.9.0",
#   "paths_released": "[\".\",\"apps/backend\"]"
# }'

# ----------------------------------------------------------------
# Main
# ----------------------------------------------------------------
echo "RELEASE_DATA: $RELEASE_DATA"
RELEASE_PATHS=$(echo "$RELEASE_DATA" | jq -r '.paths_released | fromjson[]')

for path in $RELEASE_PATHS; do
  if [[ $path == "." ]]; then
    prefix=""
  else
    prefix="${path}--"
  fi

  VERSION=$(echo "$RELEASE_DATA" | jq -r ".[\"${prefix}version\"]")
  TAG_NAME=$(echo "$RELEASE_DATA" | jq -r ".[\"${prefix}tag_name\"]")

  CHANGELOG_PATH="$path/CHANGELOG.md"
  RELEASE_NOTES_PATH=$(mktemp)

  awk -v ver="$VERSION" '
    BEGIN {flag=0}
    flag==0 && $0 ~ "^## \\["ver {
      flag=1
    }
    flag==1 && $0 ~ "^## \\[" && $0 !~ ver {
      flag=0
    }
    flag==1
  ' "$CHANGELOG_PATH" > "$RELEASE_NOTES_PATH"

  echo "gh release edit \"$TAG_NAME\" --notes-file \"$RELEASE_NOTES_PATH\""
  if [[ "${CI:-}" == "true" ]]; then
    gh release edit "$TAG_NAME" --notes-file "$RELEASE_NOTES_PATH"
  fi
done
