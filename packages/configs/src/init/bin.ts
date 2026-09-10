import { init } from ".";

const { notes, removedDependencies } = await init({ cwd: process.cwd() });

for (const name of removedDependencies) {
  process.stdout.write(`- removed ${name} from devDependencies\n`);
}

for (const note of notes) {
  process.stdout.write(`! ${note}\n`);
}

process.stdout.write("✓ @nozomiishii/configs installed\n");
