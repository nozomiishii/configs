import { init } from ".";

await init({ cwd: process.cwd() });
process.stdout.write("✓ @nozomiishii/eslint-config installed\n");
