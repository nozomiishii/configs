import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const cli = fileURLToPath(import.meta.resolve("cspell/bin.mjs"));
const configPath = fileURLToPath(new URL("./index.js", import.meta.url));

spawn(process.execPath, [cli, "--config", configPath, ...process.argv.slice(2)], {
  stdio: "inherit",
}).on("exit", (code) => process.exit(code ?? 1));
