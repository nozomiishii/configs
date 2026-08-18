#!/bin/bash

# エラー・未定義変数・パイプラインの失敗で終了し、リダイレクトによる上書きを防ぐ
set -Ceuo pipefail

echo -e "Installing dependencies..."
pnpm add -D markdownlint-cli2 @nozomiishii/markdownlint-cli2-config

echo -e "Adding npm scripts..."
npm pkg set scripts.markdownlint="markdownlint-cli2 '**/*.md' '#node_modules'"
npm pkg set scripts.lint:md="pnpm markdownlint"
npm pkg set scripts.lint:md:fix="pnpm markdownlint --fix"

echo -e "Creating .markdownlint-cli2.mjs"
find . -type f -name '.markdownlint-cli2*' -delete
echo "export { default } from '@nozomiishii/markdownlint-cli2-config';" > .markdownlint-cli2.mjs

echo -e "All set! Your markdownlint-cli2 configuration has been set up successfully🎉"
