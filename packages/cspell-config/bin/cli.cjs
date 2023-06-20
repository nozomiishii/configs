#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');

const configPath = path.resolve(__dirname, '../index.cjs');
const args = process.argv.slice(2);

const result = spawnSync('npx', ['-y', 'cspell', '--config', configPath, ...args], {
  stdio: 'inherit',
});

if (result.status !== 0) {
  process.exit(result.status);
}
