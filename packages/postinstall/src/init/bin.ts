import { init } from ".";

await init({ cwd: process.cwd() });
process.stdout.write("✓ @nozomiishii/postinstall installed\n");
