import figlet from "figlet";
import fs from "node:fs";
import path from "node:path";
import { env } from "node:process";
import { echo } from "zx";

/**
 * Display a welcome message
 */
export function welcome() {
  try {
    // Get workspace root package.json path using INIT_CWD
    // INIT_CWD contains the directory where the command (e.g., pnpm install) was originally run.
    // See: https://docs.npmjs.com/cli/v10/using-npm/scripts#environment
    const projectRoot = env.INIT_CWD ?? ".";
    const packageJsonPath = path.resolve(projectRoot, "package.json");

    // Read and parse package.json
    const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
    const { name } = JSON.parse(packageJsonContent) as { name?: unknown };

    // Don't display anything if package name is missing
    if (typeof name !== "string" || !name) {
      return;
    }

    // For scoped packages (e.g., @scope/name)
    if (name.includes("/")) {
      const separator = name.indexOf("/");
      const scope = name.slice(0, separator);
      const namePart = name.slice(separator + 1);

      echo(`${scope}/`);
      echo(createAsciiArt(namePart));

      return;
    }

    // For non-scoped packages
    echo(createAsciiArt(name));
  } catch (error) {
    console.error("Failed to display welcome message:", error);
  }
}

/**
 * Convert text to ASCII art
 */
function createAsciiArt(text: string) {
  return figlet.textSync(text, {
    font: "ANSI Shadow",
  });
}
