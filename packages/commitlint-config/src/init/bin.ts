import { init } from ".";

await init({ cwd: process.cwd() });
process.stdout.write("✓ @nozomiishii/commitlint-config installed\n");
