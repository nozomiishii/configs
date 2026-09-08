import { detect, getUserAgent } from "package-manager-detector";
import { init } from ".";

const cwd = process.cwd();

// pnpm では publicHoistPattern が要る。nozo init と同じく利用先の lockfile / packageManager を優先し、無ければこの bin を起動したランナーを使う。
const detected = await detect({ cwd });
const agent = detected?.name ?? getUserAgent() ?? undefined;

const { removedDependencies } = await init({ cwd, ...(agent !== undefined && { agent }) });

for (const name of removedDependencies) {
  process.stdout.write(`- removed ${name} from devDependencies\n`);
}

process.stdout.write("✓ @nozomiishii/configs installed\n");
