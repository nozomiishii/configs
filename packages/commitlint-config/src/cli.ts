#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const cli = require.resolve('@commitlint/cli/cli.js');

spawn(process.execPath, [cli, ...process.argv.slice(2)], { stdio: 'inherit' }).on('exit', (code) =>
  process.exit(code ?? 1),
);
