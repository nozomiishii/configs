import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { format, resolveConfig } from "prettier";
import { expect, test } from "vitest";

const unformattedSource = `export const routeTree={path:'/'}`;

async function formatWithSharedConfig(relativePath: string): Promise<string> {
  const tmpDir = mkdtempSync(path.join(tmpdir(), "nozo-prettier-config-"));
  const configPath = path.join(tmpDir, "prettier.config.mjs");
  const sourceConfigUrl = pathToFileURL(fileURLToPath(new URL("index.ts", import.meta.url)));
  writeFileSync(configPath, `export { default } from ${JSON.stringify(sourceConfigUrl.href)};\n`);

  try {
    const filepath = path.join(tmpDir, relativePath);
    const config = await resolveConfig(filepath, { config: configPath });

    expect(config).not.toBeNull();

    return await format(unformattedSource, { ...config, filepath });
  } finally {
    rmSync(tmpDir, { force: true, recursive: true });
  }
}

test.each(["routeTree.gen.ts", "apps/web/src/routeTree.gen.ts"])(
  "does not format generated TanStack Router route tree at %s",
  async (relativePath) => {
    await expect(formatWithSharedConfig(relativePath)).resolves.toBe(unformattedSource);
  },
);

test("continues to format non-generated route trees", async () => {
  await expect(formatWithSharedConfig("apps/web/src/routeTree.ts")).resolves.toBe(
    'export const routeTree = { path: "/" };\n',
  );
});
