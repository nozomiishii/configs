#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cspellBin = fileURLToPath(import.meta.resolve('cspell/bin.mjs'));
const configPath = fileURLToPath(new URL('../dist/index.js', import.meta.url));

const result = spawnSync(process.execPath, [cspellBin, '--config', configPath, ...process.argv.slice(2)], {
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
