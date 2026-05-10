import * as p from "@clack/prompts";
import { init as initCommitlint } from "@nozomiishii/commitlint-config/init";
import { init as initEslint } from "@nozomiishii/eslint-config/init";
import { init as initLefthook } from "@nozomiishii/lefthook-config/init";
import { init as initPostinstall } from "@nozomiishii/postinstall/init";
import { init as initPrettier } from "@nozomiishii/prettier-config/init";
import { defineCommand } from "citty";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { type AgentName, detect } from "package-manager-detector";

const exec = promisify(execFile);

type ToolInit = (options: { cwd: string }) => Promise<void>;

export const tools = {
  commitlint: {
    description: "Commit-message linting via commitlint",
    label: "@nozomiishii/commitlint-config",
    run: initCommitlint,
  },
  eslint: {
    description: "JS/TS linting via ESLint",
    label: "@nozomiishii/eslint-config",
    run: initEslint,
  },
  lefthook: {
    description: "Git hooks via lefthook",
    label: "@nozomiishii/lefthook-config",
    run: initLefthook,
  },
  postinstall: {
    description: "Repo bootstrap via @nozomiishii/postinstall",
    label: "@nozomiishii/postinstall",
    run: initPostinstall,
  },
  prettier: {
    description: "Code formatting via Prettier",
    label: "@nozomiishii/prettier-config",
    run: initPrettier,
  },
} as const satisfies Record<string, { description: string; label: string; run: ToolInit }>;

export type ToolId = keyof typeof tools;

export const toolIds = Object.keys(tools) as ToolId[];

async function detectPackageManager(cwd: string): Promise<AgentName> {
  const result = await detect({ cwd });

  if (result === null) {
    throw new Error("Could not detect package manager (no lockfile or packageManager field).");
  }

  return result.name;
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
      spinner.start(`Installing ${tool.label}`);

      try {
        await tool.run({ cwd });
        spinner.stop(`${tool.label}: ok`);
      } catch (error) {
        spinner.stop(`${tool.label}: failed`);
        p.cancel(error instanceof Error ? error.message : String(error));

        return;
      }
    }

    const installSpinner = p.spinner();
    installSpinner.start(`Installing devDependencies with ${agent}`);

    try {
      await exec(agent, ["install"], { cwd });
      installSpinner.stop("Installed");
    } catch (error) {
      installSpinner.stop("Install failed");
      p.cancel(error instanceof Error ? error.message : String(error));

      return;
    }

    p.outro("done");
  },
});
