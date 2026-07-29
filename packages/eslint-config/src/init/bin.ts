import { init, tsconfigIncludeReports } from ".";

const { tsconfigInclude } = await init({ cwd: process.cwd() });
process.stdout.write("✓ @nozomiishii/eslint-config installed\n");
process.stdout.write(`${tsconfigIncludeReports[tsconfigInclude].message}\n`);
