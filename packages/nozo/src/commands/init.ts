import * as p from "@clack/prompts";
import { defineCommand } from "citty";
import { consola } from "consola";

export default defineCommand({
  meta: {
    name: "init",
    description: "Initialize a project with nozo configs",
  },
  args: {
    tool: {
      type: "positional",
      required: false,
      description: "Tool to set up (lefthook, commitlint, cspell)",
    },
    verbose: {
      type: "boolean",
      alias: "v",
      description: "Verbose output",
    },
  },
  async run({ args }) {
    if (args.verbose) consola.level = 4;

    p.intro("🥊 nozo init");
    consola.info("init はまだ骨格だけです");
    if (args.tool) {
      consola.info(`requested tool: ${args.tool}`);
    }
    p.outro("done");
  },
});
