import { readFileSync } from 'node:fs';
import path from 'node:path';

type PackageJson = {
  pnpm?: {
    executionEnv?: {
      nodeVersion?: string;
    };
  };
};

/**
 * package.jsonからpnpm.executionEnv.nodeVersionを取得
 *
 * @returns nodeVersionの値、存在しない場合はundefined
 */
export function getNodeVersion(): string | undefined {
  try {
    // プロジェクトルートのpackage.jsonを読み込み
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJsonContent = readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent) as PackageJson;

    return packageJson.pnpm?.executionEnv?.nodeVersion;
  } catch {
    // ファイルが存在しない場合やJSONパースエラーの場合はundefinedを返す
    return undefined;
  }
}
