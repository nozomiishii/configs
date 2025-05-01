import { setupLefthook } from './lefthook';
import { setupVSCode } from './vscode';
import { welcome } from './welcome';
import { setupAct } from './act';

await setupVSCode();
await setupAct();
await setupLefthook();
await welcome();
