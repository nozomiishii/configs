import * as p from "@clack/prompts";
import { init as initCommitlint } from "@nozomiishii/commitlint-config/init";
import { init as initConfigs } from "@nozomiishii/configs/init";
import { init as initEslint, type PresetId } from "@nozomiishii/eslint-config/init";
import { init as initLefthook } from "@nozomiishii/lefthook-config/init";
import { init as initOxfmt } from "@nozomiishii/oxfmt-config/init";
import { init as initPostinstall } from "@nozomiishii/postinstall/init";
import { init as initPrettier } from "@nozomiishii/prettier-config/init";
import { defineCommand } from "citty";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { type AgentName, detect, type DetectOptions, getUserAgent } from "package-manager-detector";

const exec = promisify(execFile);

export interface EslintConfig {
  monorepo: boolean;
  preset: PresetId;
}

export type InitMode = "configs" | "individual";

export interface RunInitOptions {
  cwd: string;
  eslint?: EslintConfig;
  /**
   * 進捗の表示先。prompt を持ち込まないよう、UI 側から渡す。
   */
  log?: (message: string) => void;
  mode: InitMode;
  /**
   * individual モードで入れるツール。configs モードでは使わない。
   */
  tools?: readonly ToolId[];
}

interface Tool {
  description: string;
  label: string;
  run: ToolInit;
}

type ToolInit = (options: { cwd: string; monorepo?: boolean; preset?: PresetId }) => Promise<void>;

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
  oxfmt: {
    description: "Code formatting via oxfmt",
    label: "@nozomiishii/oxfmt-config",
    run: initOxfmt,
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

export const defaultToolIds = toolIds.filter((id) => id !== "prettier");

export async function resolvePackageManager(
  cwd: string,
  // 探索の終端。省略時はファイルシステムのルートまで遡る。
  stopDir?: DetectOptions["stopDir"],
): Promise<{ agent: AgentName; source: "project" | "runner" }> {
  const detected = await detect(stopDir === undefined ? { cwd } : { cwd, stopDir });

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

/**
 * prompt の答えを受け取って実際の scaffold を行う。prompt を含まないのでテストから直接呼べる。
 */
export async function runInit({
  cwd,
  eslint,
  log,
  mode,
  tools: selected = [],
}: RunInitOptions): Promise<void> {
  const report = (message: string): void => {
    log?.(message);
  };

  if (mode === "configs") {
    report("Installing @nozomiishii/configs");

    const { notes, removedDependencies } = await initConfigs({ cwd, ...eslint });

    for (const name of removedDependencies) {
      report(`Removed ${name} from devDependencies; it now comes from @nozomiishii/configs`);
    }

    for (const note of notes) {
      report(note);
    }

    return;
  }

  for (const id of selected) {
    const tool = tools[id];
    report(`Installing ${tool.label}`);

    await tool.run(id === "eslint" && eslint !== undefined ? { cwd, ...eslint } : { cwd });
  }
}

/**
 * ESLint の starter を決めるのに要る 2 問。configs モードでも individual モードでも同じことを聞く。
 */
async function promptEslintConfig(): Promise<EslintConfig | null> {
  const preset = await p.select<PresetId>({
    initialValue: "nextjs",
    message: "Which ESLint preset?",
    options: [
      { hint: "React / Next.js web app", label: "nextjs", value: "nextjs" },
      {
        hint: "React / TanStack Start (Vite) web app",
        label: "tanstack-start",
        value: "tanstack-start",
      },
      { hint: "CLI / library (Node.js)", label: "node", value: "node" },
    ],
  });

  if (p.isCancel(preset)) {
    return null;
  }

  const monorepo = await p.select<boolean>({
    initialValue: false,
    message: "Is this a per-package config in a monorepo?",
    options: [
      {
        hint: "one eslint.config for the whole repo",
        label: "single repo",
        value: false,
      },
      {
        hint: "each package has its own; sets tsconfigRootDir",
        label: "monorepo (per-package)",
        value: true,
      },
    ],
  });

  if (p.isCancel(monorepo)) {
    return null;
  }

  return { monorepo, preset };
}

export default defineCommand({
  meta: {
    description: "Initialize a project with nozo configs",
    name: "init",
  },
  async run() {
    p.intro("nozo init");

    const mode = await p.select<InitMode>({
      initialValue: "configs",
      message: "How do you want to set up this project?",
      options: [
        {
          hint: "@nozomiishii/configs, the recommended bundle in one dependency",
          label: "configs",
          value: "configs",
        },
        { hint: "pick the config packages yourself", label: "individual", value: "individual" },
      ],
    });

    if (p.isCancel(mode)) {
      p.cancel("Cancelled.");

      return;
    }

    let selected: ToolId[] = [];

    if (mode === "individual") {
      const picked = await p.multiselect<ToolId>({
        initialValues: defaultToolIds,
        message: "Which tools do you want to set up?",
        options: toolIds.map((id) => ({
          hint: tools[id].description,
          label: id,
          value: id,
        })),
        required: true,
      });

      if (p.isCancel(picked)) {
        p.cancel("Cancelled.");

        return;
      }

      selected = picked;
    }

    // 追加設定が要るのは ESLint だけ。install 前に尋ねる。
    let eslint: EslintConfig | undefined;

    if (mode === "configs" || selected.includes("eslint")) {
      const configured = await promptEslintConfig();

      if (configured === null) {
        p.cancel("Cancelled.");

        return;
      }

      eslint = configured;
    }

    const cwd = process.cwd();
    const { agent, source } = await resolvePackageManager(cwd);
    p.log.info(
      source === "project"
        ? `Detected package manager: ${agent}`
        : `No package manager configured; using ${agent} from the current runner`,
    );

    // spinner 表示中の出力は上書きされるので、集めてから止めた後に出す。
    const messages: string[] = [];
    const spinner = p.spinner();
    spinner.start("Writing configs");

    try {
      await runInit({
        cwd,
        log: (message) => {
          messages.push(message);
        },
        mode,
        tools: selected,
        ...(eslint !== undefined && { eslint }),
      });
      spinner.stop("Configs written");
    } catch (error) {
      spinner.stop("Failed");
      p.cancel(error instanceof Error ? error.message : String(error));

      return;
    }

    for (const message of messages) {
      p.log.info(message);
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
