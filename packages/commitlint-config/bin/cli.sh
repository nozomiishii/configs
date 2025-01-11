#!/bin/bash

# -C          : Prevent overwriting files with output redirection
# -e          : Exit the script if any command returns a non-zero status
# -u          : Exit the script if an undefined variable is used
# -o pipefail : Change pipeline exit status to the last non-zero exit
#               code in the pipeline, or zero if all commands succeed
# -x          : (Optional) Enable command tracing for easier debugging
set -Ceuo pipefail

echo -e "Installing dependencies..."

if grep -q '"@commitlint/config-conventional"' package.json; then
  echo "Removing @commitlint/config-conventional..."
  pnpm remove @commitlint/config-conventional
fi

pnpm add -D @nozomiishii/commitlint-config

echo -e "Adding npm scripts..."
npm pkg set type="module"

echo -e "Creating commitlint.config.js"
find . -type f -name 'commitlint.config.*' -delete

cat > commitlint.config.ts << EOF
export default { extends: ['@nozomiishii'] };
EOF

echo -e "All set! Your Commitlint configuration has been set up successfully🎉"
