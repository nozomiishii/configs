import { init } from "./index.js";

await init({ cwd: process.cwd() });
process.stdout.write("✓ @nozomiishii/postinstall installed\n");
