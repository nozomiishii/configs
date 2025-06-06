#!/bin/bash

# -C          : Prevent overwriting files with output redirection
# -e          : Exit the script if any command returns a non-zero status
# -u          : Exit the script if an undefined variable is used
# -o pipefail : Change pipeline exit status to the last non-zero exit
#               code in the pipeline, or zero if all commands succeed
# -x          : (Optional) Enable command tracing for easier debugging
set -Ceuo pipefail

echo -e "Installing dependencies..."
pnpm add -D @nozomiishii/prettier-config

echo -e "Adding npm scripts..."
npm pkg set type="module"
npm pkg set scripts.format="pnpm prettier . --check"
npm pkg set scripts.format:fix="pnpm prettier . --write"
npm pkg set scripts.prettier="prettier --ignore-unknown --ignore-path ./.gitignore"

echo -e "Creating prettier.config.js"
find . -type f -name '.prettierrc*' -delete
find . -type f -name 'prettier.config.*' -delete
echo "export { default } from '@nozomiishii/prettier-config';" > prettier.config.js

echo -e "All set! Your Prettier configuration has been set up successfully🎉"
