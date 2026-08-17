import { spawn } from "node:child_process";
import { buildCommitlintArgs, resolveCommitlintCli, resolveSelfConfigPath } from ".";

const args = buildCommitlintArgs(process.argv.slice(2), resolveSelfConfigPath);

spawn(process.execPath, [resolveCommitlintCli(), ...args], { stdio: "inherit" }).on(
  "exit",
  (code) => {
    process.exitCode = code ?? 1;
  },
);
