import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { resolveArgs } from "./resolve-args";

const require = createRequire(import.meta.url);
const cli = require.resolve("@commitlint/cli/cli.js");

spawn(process.execPath, [cli, ...resolveArgs(process.argv.slice(2))], { stdio: "inherit" }).on(
  "exit",
  (code) => {
    process.exitCode = code ?? 1;
  },
);
