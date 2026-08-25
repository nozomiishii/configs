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
    { routePath: "{-$locale}.about-us.tsx" },
    { routePath: "{-$locale}.$postId.tsx" },
    { routePath: "{-$locale}/about.tsx" },
  ])("accepts the optional route path $routePath", async ({ routePath }) => {
    await expect(lintRoutePath(routePath)).resolves.toHaveLength(0);
  });

  test.for([
    { routePath: "-private.tsx" },
    { routePath: "-private/about.tsx" },
    { routePath: "about_.tsx" },
    { routePath: "{-$locale}/-private.tsx" },
    { routePath: "{-$locale}/about_.tsx" },
  ])("keeps accepting the existing route path $routePath", async ({ routePath }) => {
    await expect(lintRoutePath(routePath)).resolves.toHaveLength(0);
  });

  test.for([
    { routePath: "AboutPage.tsx" },
    { routePath: "{-$123}.tsx" },
    { routePath: "{-$locale}-Page.tsx" },
    { routePath: "{-$locale}/AboutPage.tsx" },
    { routePath: "{-$locale}/badDirectory/about.tsx" },
  ])("still rejects the non-matching route path $routePath", async ({ routePath }) => {
    await expect(lintRoutePath(routePath)).resolves.toHaveLength(1);
  });

  test("rejects an optional route name outside the routes directory", async () => {
    await expect(lintPath("src/components/{-$locale}.tsx")).resolves.toHaveLength(1);
  });

  test.for([
    { relativePath: "{-$workspace}/src/routes/about.tsx" },
    { relativePath: "{-$workspace}/src/routes/AboutPage.tsx" },
  ])(
    "rejects the path with an optional name before routes: $relativePath",
    async ({ relativePath }) => {
      await expect(lintPath(relativePath)).resolves.toHaveLength(1);
    },
  );

  test("composes with a consumer Unicorn plugin registration", async () => {
    const composedEslint = new ESLint({
      cwd: import.meta.dirname,
      overrideConfig: [
        { files: ["**/*.tsx"], plugins: { unicorn: unicornPlugin } },
        unicornConfig,
        filenameCaseConfig,
      ],
      overrideConfigFile: true,
    });

    await expect(
      composedEslint.calculateConfigForFile(
        path.join(import.meta.dirname, "src/routes/{-$locale}.tsx"),
      ),
    ).resolves.toBeDefined();
  });
});
