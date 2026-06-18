/**
 * preset (base / node / nextjs) に渡す options。
 */
export type Options = {
  typescript?: TypescriptOptions;
};

/**
 * TypeScript preset の options。
 */
export type TypescriptOptions = {
  /**
   * type-aware linting の基準ディレクトリ。
   * 各 consumer の eslint.config の `import.meta.dirname` を渡す。
   *
   * 未指定だと typescript-eslint は call stack から eslint.config の場所を推測する。
   * editor は複数 package の config を 1 プロセスで評価するため候補が複数になり
   * "multiple candidate TSConfigRootDirs" で落ちる。値は consumer の dir でしか
   * 決められないため consumer が渡す。
   *
   * @see https://typescript-eslint.io/packages/parser/#tsconfigrootdir
   */
  tsconfigRootDir?: string;
};
