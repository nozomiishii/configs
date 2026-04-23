import { execSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { test, expect } from 'vitest';

const packageDir = resolve(import.meta.dirname, '..');
const distDir = resolve(packageDir, 'dist');

// ビルド成果物に .map ファイルが含まれないことを検証する
// `pnpm build` の実行を含むため、CI runner の負荷ブレで 5s デフォルトを超えうる（実測 5137ms / 7143ms）
test('build output should not contain .map files', { timeout: 30_000 }, () => {
  execSync('pnpm build', { cwd: packageDir });

  const mapFiles = readdirSync(distDir).filter((f) => f.endsWith('.map'));

  expect(mapFiles).toStrictEqual([]);
});
