#!/bin/bash

# -C          : Prevent overwriting files with output redirection
# -e          : Exit the script if any command returns a non-zero status
# -u          : Exit the script if an undefined variable is used
# -o pipefail : Change pipeline exit status to the last non-zero exit
#               code in the pipeline, or zero if all commands succeed
# -x          : (Optional) Enable command tracing for easier debugging
set -Ceuo pipefail

echo -e "Installing dependencies..."
pnpm add -D eslint typescript @nozomiishii/eslint-config

echo -e "Adding npm scripts..."
pnpm pkg set scripts.eslint="eslint --max-warnings=0 --cache"
pnpm pkg set scripts.lint="pnpm eslint"
pnpm pkg set scripts.lint:fix="pnpm eslint --fix"

echo -e "Creating eslint.config.ts..."
cat > eslint.config.ts << EOF
export { default } from '@nozomiishii/eslint-config';
EOF

echo -e "All set! Your ESLint configuration has been set up successfully🎉"
