import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { type AgentName, detect } from "package-manager-detector";

export type { AgentName };

const exec = promisify(execFile);

export async function detectPackageManager(cwd: string): Promise<AgentName> {
  const result = await detect({ cwd });

  if (result === null) {
    throw new Error("Could not detect package manager (no lockfile or packageManager field).");
  }

  if (result.name === "deno") {
    throw new Error("nozo does not support deno yet.");
  }

  return result.name;
}

// nozo init では各 nozo-<pkg>-init bin が consumer の package.json に devDependencies を pin で
// 書き込んだ後、最後にここを呼んで lockfile / node_modules を反映する。
export async function runInstall(agent: AgentName, cwd: string): Promise<void> {
  await exec(agent, ["install"], { cwd });
}
