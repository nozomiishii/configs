import { defineCommand, runMain } from "citty";
import { consola } from "consola";
import { spawn } from "node:child_process";
import { access, constants } from "node:fs/promises";
import path from "node:path";
import pkg from "../package.json" with { type: "json" };
import init from "./commands/init.js";

const BUILTIN_COMMANDS = new Set(["init"]);

async function execExternal(command: string, args: string[]): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("exit", (code) => {
      resolve(code ?? 0);
    });
    child.on("error", () => {
      resolve(1);
    });
  });
}

async function findOnPath(name: string): Promise<null | string> {
  const exe = process.platform === "win32" ? `${name}.exe` : name;

  // eslint-disable-next-line n/no-process-env -- PATH dispatch needs process.env.PATH
  for (const dir of (process.env.PATH ?? "").split(path.delimiter)) {
    if (!dir) continue;
    const candidate = path.join(dir, exe);

    try {
      await access(candidate, constants.X_OK);

      return candidate;
    } catch {
      // not found, try next
    }
  }

  return null;
}

const sub = process.argv[2];
const isFlag = sub?.startsWith("-") ?? false;
const isBuiltin = sub !== undefined && BUILTIN_COMMANDS.has(sub);

if (sub !== undefined && !isFlag && !isBuiltin) {
  // PATH dispatch (cargo / git style)
  const ext = await findOnPath(`nozo-${sub}`);

  if (ext === null) {
    consola.error(`'${sub}' is not a nozo command. See 'nozo --help'.`);
    // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit -- CLI exit code 127 mimics shell
    process.exit(127);
  }
  // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit -- CLI passes through subprocess exit code
  process.exit(await execExternal(ext, process.argv.slice(3)));
}

// Built-in command (or --help / --version / no args) → citty に委譲
const main = defineCommand({
  meta: {
    description: "Nozomi's config manager",
    name: "nozo",
    version: pkg.version,
  },
  subCommands: {
    init,
  },
});

await runMain(main);
