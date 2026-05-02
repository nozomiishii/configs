import * as p from "@clack/prompts";
import { starter as lefthookYaml } from "@nozomiishii/lefthook-config/starter";
import { defineCommand } from "citty";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { detectAgent, installDevDeps } from "../core/ni.js";

type ToolManifest = {
  description: string;
  devDeps: string[];
  files: { content: string; path: string }[];
};

const tools = {
  lefthook: {
    description: "Git hooks via lefthook",
    devDeps: ["lefthook", "@nozomiishii/lefthook-config"],
    files: [{ content: lefthookYaml, path: "lefthook.yaml" }],
  },
} satisfies Record<string, ToolManifest>;

type ToolId = keyof typeof tools;

const toolIds = Object.keys(tools) as ToolId[];

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
    const agent = await detectAgent(cwd);
    p.log.info(`Detected package manager: ${agent}`);

    for (const id of selected) {
      const tool = tools[id];
      p.log.step(`${id}: ${tool.description}`);

      for (const file of tool.files) {
        const fullPath = path.join(cwd, file.path);
        await mkdir(path.dirname(fullPath), { recursive: true });
        await writeFile(fullPath, file.content, "utf8");
        p.log.info(`  ${file.path}: written`);
      }
    }

    const allDeps = [...new Set(selected.flatMap((id) => tools[id].devDeps))];

    const spinner = p.spinner();
    spinner.start(`Installing ${String(allDeps.length)} package(s) with ${agent}`);

    try {
      await installDevDeps(agent, allDeps, cwd);
      spinner.stop("Installed");
    } catch (error) {
      spinner.stop("Install failed");
      p.cancel(error instanceof Error ? error.message : String(error));

      return;
    }

    p.outro("done");
  },
});
