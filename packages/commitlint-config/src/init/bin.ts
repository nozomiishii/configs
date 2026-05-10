import { init } from "./index.js";

await init({ cwd: process.cwd() });
process.stdout.write("✓ @nozomiishii/commitlint-config installed\n");
