import { spawn } from "node:child_process";
import { type AgentName, detect } from "package-manager-detector";

export type { AgentName };

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

// `<agent> install` を spawn する。
// nozo init では各 nozo-<pkg>-init bin が consumer の package.json に devDependencies を pin で
// 書き込んだ後、最後にここを呼んで lockfile / node_modules を反映する想定。
export async function runInstall(agent: AgentName, cwd: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(agent, ["install"], {
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
      reject(new Error(`${agent} install exited with code ${String(code ?? "unknown")}\n${detail}`));
    });
    child.on("error", reject);
  });
}
