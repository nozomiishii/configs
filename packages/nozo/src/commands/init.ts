import * as p from "@clack/prompts";
import { init as initCommitlint } from "@nozomiishii/commitlint-config/init";
import { init as initEslint, type PresetId } from "@nozomiishii/eslint-config/init";
import { init as initLefthook } from "@nozomiishii/lefthook-config/init";
import { init as initPostinstall } from "@nozomiishii/postinstall/init";
import { init as initPrettier } from "@nozomiishii/prettier-config/init";
import { defineCommand } from "citty";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { type AgentName, detect, getUserAgent } from "package-manager-detector";

const exec = promisify(execFile);

type Tool = {
  configure?: () => Promise<null | { preset: PresetId }>;
  description: string;
  label: string;
  run: ToolInit;
};

type ToolInit = (options: { cwd: string; preset?: PresetId }) => Promise<void>;

export const tools = {
  commitlint: {
    description: "Commit-message linting via commitlint",
    label: "@nozomiishii/commitlint-config",
    run: initCommitlint,
  },
  eslint: {
    configure: async () => {
      const preset = await p.select<PresetId>({
        initialValue: "nextjs",
        message: "Which ESLint preset?",
        options: [
          { hint: "React / Next.js web app", label: "nextjs", value: "nextjs" },
          { hint: "CLI / library (Node.js)", label: "node", value: "node" },
        ],
      });

      if (p.isCancel(preset)) {
        return null;
      }

      return { preset };
    },
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
} as const satisfies Record<string, Tool>;

export type ToolId = keyof typeof tools;

export const toolIds = Object.keys(tools) as ToolId[];

export async function resolvePackageManager(
  cwd: string,
): Promise<{ agent: AgentName; source: "project" | "runner" }> {
  const detected = await detect({ cwd });

  if (detected !== null) {
    return { agent: detected.name, source: "project" };
  }

  // lockfile も packageManager フィールドも無い → nozo を起動したランナーを使う
  const runner = getUserAgent();

  if (runner !== null) {
    return { agent: runner, source: "runner" };
  }

  throw new Error(
    "Could not determine a package manager. Run nozo through a package manager such as `pnpm dlx nozo init`, `npx nozo init`, or `bunx nozo init`.",
  );
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

    // 追加設定が要るツールは install 前にまとめて尋ねる
    const presets: Partial<Record<ToolId, PresetId>> = {};

    for (const id of selected) {
      const tool = tools[id];

      if (!("configure" in tool)) {
        continue;
      }

      const configured = await tool.configure();

      if (configured === null) {
        p.cancel("Cancelled.");

        return;
      }

      presets[id] = configured.preset;
    }

    const cwd = process.cwd();
    const { agent, source } = await resolvePackageManager(cwd);
    p.log.info(
      source === "project"
        ? `Detected package manager: ${agent}`
        : `No package manager configured; using ${agent} from the current runner`,
    );

    for (const id of selected) {
      const tool = tools[id];
      const spinner = p.spinner();
      spinner.start(`Installing ${tool.label}`);

      try {
        const preset = presets[id];
        await tool.run(preset === undefined ? { cwd } : { cwd, preset });
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
