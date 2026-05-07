import { detect, getCommand } from "@antfu/ni";
import { spawn } from "node:child_process";

export type Agent = NonNullable<Awaited<ReturnType<typeof detect>>>;

export async function detectAgent(cwd: string): Promise<Agent> {
  const agent = await detect({ cwd });

  if (agent === undefined) {
    throw new Error("Could not detect package manager (no lockfile or packageManager field).");
  }

  return agent;
}

// `pnpm install` / `npm install` / `yarn install` / `bun install` 相当を spawn する。
// nozo init では各 nozo-<tool>-init bin が consumer の package.json に devDependencies を pin で
// 書き込んだ後、最後にここを呼んで lockfile / node_modules を反映する想定。
export async function runInstall(agent: Agent, cwd: string): Promise<void> {
  const resolved = getCommand(agent, "install", []);
  await new Promise<void>((resolve, reject) => {
    const child = spawn(resolved.command, resolved.args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();

        return;
      }
      const detail = stderr.trim() || stdout.trim() || "(no output)";
      reject(
        new Error(`${resolved.command} exited with code ${String(code ?? "unknown")}\n${detail}`),
      );
    });
    child.on("error", reject);
  });
}
