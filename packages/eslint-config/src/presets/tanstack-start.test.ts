import { ESLint } from "eslint";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { tanstackStart } from "../../presets/tanstack-start";

const tanstackStartConfig = tanstackStart();
const filenameCaseConfig = tanstackStartConfig.find(
  (config) => config.name === "@nozomiishii/tanstack-start/filename-case",
);
const unicornConfig = tanstackStartConfig.find((config) => config.name === "@nozomiishii/unicorn");
const unicornPlugin = unicornConfig?.plugins?.unicorn;

if (!filenameCaseConfig || !unicornConfig || !unicornPlugin) {
  throw new Error("The TanStack Start filename-case config is incomplete.");
}

const eslint = new ESLint({
  cwd: import.meta.dirname,
  overrideConfig: [
    {
      files: ["**/*.tsx"],
      plugins: { unicorn: unicornPlugin },
      rules: { "unicorn/filename-case": "error" },
    },
    filenameCaseConfig,
  ],
  overrideConfigFile: true,
});

async function lintPath(relativePath: string) {
  const [result] = await eslint.lintText("", {
    filePath: path.join(import.meta.dirname, relativePath),
  });

  return result?.messages.filter(({ ruleId }) => ruleId?.endsWith("/filename-case")) ?? [];
}

async function lintRoutePath(routePath: string) {
  return lintPath(path.join("src/routes", routePath));
}

describe("tanstackStart filename-case", () => {
  test.for([
    { routePath: "{-$locale}.tsx" },
    { routePath: "{-$locale}/about.tsx" },
    { routePath: "-private.tsx" },
    { routePath: "about_.tsx" },
    { routePath: "AboutPage.tsx" },
    { routePath: "{-$locale}/AboutPage.tsx" },
    { routePath: "{-$locale}/badDirectory/about.tsx" },
  ])("ignores the route path $routePath", async ({ routePath }) => {
    await expect(lintRoutePath(routePath)).resolves.toHaveLength(0);
  });

  test.for([
    { relativePath: "src/components/AboutPage.tsx" },
    { relativePath: "src/components/{-$locale}.tsx" },
    { relativePath: "src/router/AboutPage.tsx" },
  ])("still rejects the non-route path $relativePath", async ({ relativePath }) => {
    await expect(lintPath(relativePath)).resolves.toHaveLength(1);
  });

  test("ignores a routes directory nested in a workspace", async () => {
    await expect(lintPath("apps/web/src/routes/AboutPage.tsx")).resolves.toHaveLength(0);
  });
});
