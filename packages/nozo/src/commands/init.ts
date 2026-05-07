import * as p from "@clack/prompts";
import { defineCommand } from "citty";
import { spawn } from "node:child_process";
import which from "which";
import { detectPackageManager, runInstall } from "../core/package-manager.js";

const tools = {
  commitlint: {
    bin: "nozo-commitlint-init",
    description: "Commit-message linting via commitlint",
  },
  eslint: {
    bin: "nozo-eslint-init",
    description: "JS/TS linting via ESLint",
  },
  lefthook: {
    bin: "nozo-lefthook-init",
    description: "Git hooks via lefthook",
  },
  postinstall: {
    bin: "nozo-postinstall-init",
    description: "Repo bootstrap via @nozomiishii/postinstall",
  },
  prettier: {
    bin: "nozo-prettier-init",
    description: "Code formatting via Prettier",
  },
} as const;

type ToolId = keyof typeof tools;

const toolIds = Object.keys(tools) as ToolId[];

// nozo の dependencies に各 config パッケージを持たせているので、
// pnpx nozo init で transient install された node_modules/.bin に各 init bin が並ぶ前提
async function runInitBin(bin: string, cwd: string): Promise<void> {
  const binPath = await which(bin, { nothrow: true });

  if (binPath === null) {
    throw new Error(`${bin} is not on PATH. nozo's dependencies should provide it.`);
  }

  await new Promise<void>((resolve, reject) => {
    const child = spawn(binPath, [], { cwd, stdio: ["ignore", "pipe", "pipe"] });

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
      reject(new Error(`${bin} exited with code ${String(code ?? "unknown")}\n${detail}`));
    });
    child.on("error", reject);
  });
}

export default defineCommand({
  meta: {
    description: "Initialize a project with nozo configs",
    name: "init",
  },
  async run() {
    p.intro("nozo init");

    const selected = await p.multiselect<ToolId>({
      initialValues: toolIds,
      message: "Which tools do you want to set up?",
      options: toolIds.map((id) => ({
        hint: tools[id].description,
        label: id,
        value: id,
      })),
      required: true,
    });

    if (p.isCancel(selected)) {
      p.cancel("Cancelled.");

      return;
    }

    const cwd = process.cwd();
    const agent = await detectPackageManager(cwd);
    p.log.info(`Detected package manager: ${agent}`);

    for (const id of selected) {
      const tool = tools[id];
      const spinner = p.spinner();
      spinner.start(`Running ${tool.bin}`);

      try {
        await runInitBin(tool.bin, cwd);
        spinner.stop(`${tool.bin}: ok`);
      } catch (error) {
        spinner.stop(`${tool.bin}: failed`);
        p.cancel(error instanceof Error ? error.message : String(error));

        return;
      }
    }

    const installSpinner = p.spinner();
    installSpinner.start(`Installing devDependencies with ${agent}`);

    try {
      await runInstall(agent, cwd);
      installSpinner.stop("Installed");
    } catch (error) {
      installSpinner.stop("Install failed");
      p.cancel(error instanceof Error ? error.message : String(error));

      return;
    }

    p.outro("done");
  },
});
