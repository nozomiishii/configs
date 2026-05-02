import { defineCommand, runMain } from "citty";
import { consola } from "consola";
import { spawn } from "node:child_process";
import which from "which";
import pkg from "../package.json" with { type: "json" };
import init from "./commands/init.js";

const BUILTIN_COMMANDS = new Set(["init"]);

// POSIX exit code returned by shells when the requested command is not on PATH
const EXIT_CODE_COMMAND_NOT_FOUND = 127;

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

async function main(): Promise<void> {
  const sub = process.argv[2];
  const isFlag = sub?.startsWith("-") ?? false;
  const isBuiltin = sub !== undefined && BUILTIN_COMMANDS.has(sub);

  if (sub !== undefined && !isFlag && !isBuiltin) {
    // PATH dispatch (cargo / git style)
    const ext = await which(`nozo-${sub}`, { nothrow: true });

    if (ext === null) {
      consola.error(`'${sub}' is not a nozo command. See 'nozo --help'.`);
      process.exitCode = EXIT_CODE_COMMAND_NOT_FOUND;

      return;
    }

    process.exitCode = await execExternal(ext, process.argv.slice(3));

    return;
  }

  // Built-in command (or --help / --version / no args) → citty に委譲
  const cmd = defineCommand({
    meta: {
      description: "Nozomi's config manager",
      name: "nozo",
      version: pkg.version,
    },
    subCommands: {
      init,
    },
  });

  await runMain(cmd);
}

await main();
