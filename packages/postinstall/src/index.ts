#!/usr/bin/env node
import { setupLefthook } from './lefthook';
import { setupVSCode } from './vscode';
import { welcome } from './welcome';
import { setupAct } from './act';
import { setupGit } from './git';

await setupGit();
await setupVSCode();
await setupAct();
await setupLefthook();
await welcome();
