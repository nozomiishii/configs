#!/usr/bin/env node
import { defineCommand, runMain } from 'citty';
import { consola } from 'consola';
import { spawn } from 'node:child_process';
import { access, constants } from 'node:fs/promises';
import { delimiter, join } from 'node:path';

import pkg from '../package.json' with { type: 'json' };
import init from './commands/init.js';

const BUILTIN_COMMANDS = new Set(['init']);

async function findOnPath(name: string): Promise<null | string> {
  const exe = process.platform === 'win32' ? `${name}.exe` : name;
  for (const dir of (process.env.PATH ?? '').split(delimiter)) {
    if (!dir) continue;
    const candidate = join(dir, exe);
    try {
      await access(candidate, constants.X_OK);
      return candidate;
    } catch {
      // not found, try next
    }
  }
  return null;
}

async function execExternal(command: string, args: string[]): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('exit', (code) => resolve(code ?? 0));
    child.on('error', () => resolve(1));
  });
}

const sub = process.argv[2];
const isFlag = sub?.startsWith('-') ?? false;
const isBuiltin = sub !== undefined && BUILTIN_COMMANDS.has(sub);

if (sub !== undefined && !isFlag && !isBuiltin) {
  // PATH dispatch (cargo / git style)
  const ext = await findOnPath(`nozo-${sub}`);
  if (ext === null) {
    consola.error(`'${sub}' is not a nozo command. See 'nozo --help'.`);
    process.exit(127);
  }
  process.exit(await execExternal(ext, process.argv.slice(3)));
}

// Built-in command (or --help / --version / no args) → citty に委譲
const main = defineCommand({
  meta: {
    name: 'nozo',
    version: pkg.version,
    description: "Nozomi's config manager",
  },
  subCommands: {
    init,
  },
});

await runMain(main);
