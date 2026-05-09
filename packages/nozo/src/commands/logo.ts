import { defineCommand } from "citty";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const GREEN = "[32m";
const RESET = "[0m";

function colorize(text: string): string {
  if (!process.stdout.isTTY) {
    return text;
  }

  return `${GREEN}${text}${RESET}`;
}

export default defineCommand({
  meta: {
    description: "Print the nozo logo",
    name: "logo",
  },
  run() {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const logo = readFileSync(path.join(here, "..", "logo.ascii"), "utf8").trimEnd();

    process.stdout.write(`${colorize(logo)}\n`);
  },
});
