import { init } from ".";

await init({ cwd: process.cwd() });
process.stdout.write("✓ @nozomiishii/prettier-config installed\n");
