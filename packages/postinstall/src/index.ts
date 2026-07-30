import { setupAct } from "./act";
import { setupGit } from "./git";
import { setupLefthook } from "./lefthook";
import { setupVSCode } from "./vscode";
import { welcome } from "./welcome";

await setupGit();
await setupVSCode();
setupAct();
await setupLefthook();
welcome();
