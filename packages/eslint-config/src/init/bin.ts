import { init } from "./index.js";

await init({ cwd: process.cwd() });
process.stdout.write("✓ @nozomiishii/eslint-config installed\n");
