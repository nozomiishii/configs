#!/bin/bash

# -C          : Prevent overwriting files with output redirection
# -e          : Exit the script if any command returns a non-zero status
# -u          : Exit the script if an undefined variable is used
# -o pipefail : Change pipeline exit status to the last non-zero exit
#               code in the pipeline, or zero if all commands succeed
# -x          : (Optional) Enable command tracing for easier debugging
set -Ceuo pipefail

echo -e "Installing dependencies..."
pnpm add -D lefthook @nozomiishii/lefthook-config

echo -e "Creating lefthook.yaml"
find . -type f -name 'lefthook.*' -delete

cat > lefthook.yaml << EOF
# @see
# https://github.com/evilmartians/lefthook
#
# Run the command to test:
#   npx -y lefthook run [-v,--verbose] <hook-name>
#
# Examples:
#   npx -y lefthook run --verbose pre-commit
#   npx -y lefthook run --verbose commit-msg
#   npx -y lefthook run --verbose post-merge

extends:
  - ./node_modules/@nozomiishii/lefthook-config/index.yaml

EOF

echo -e "Installing lefthook Git hooks"

if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  git init
fi

npx -y lefthook install --verbose

echo -e "All set! Your lefthook configuration has been set up successfully🎉"
