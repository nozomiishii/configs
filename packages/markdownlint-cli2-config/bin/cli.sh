#!/bin/bash

# -C          : Prevent overwriting files with output redirection
# -e          : Exit the script if any command returns a non-zero status
# -u          : Exit the script if an undefined variable is used
# -o pipefail : Change pipeline exit status to the last non-zero exit
#               code in the pipeline, or zero if all commands succeed
# -x          : (Optional) Enable command tracing for easier debugging
set -Ceuo pipefail

echo -e "Installing dependencies..."
pnpm add -D @nozomiishii/markdownlint-cli2-config

echo -e "Adding npm scripts..."
npm pkg set scripts.markdownlint="markdownlint-cli2 '**/*.md' '#node_modules'"
npm pkg set scripts.lint:md="pnpm markdownlint"
npm pkg set scripts.lint:md:fix="pnpm markdownlint --fix"

echo -e "Creating markdownlint-cli2.cjs"
find . -type f -name '.markdownlint-cli2*' -delete
echo "module.exports = require('@nozomiishii/markdownlint-cli2-config');" > .markdownlint-cli2.cjs

echo -e "All set! Your markdownlint-cli2 configuration has been set up successfully🎉"
