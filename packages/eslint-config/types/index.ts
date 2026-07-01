/**
 * better-tailwindcss preset の options。
 *
 * @see https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/settings/settings.md
 */
export type BetterTailwindcssOptions = {
  /**
   * tailwindcss と config を解決する作業ディレクトリ。
   * パッケージごとに eslint.config.ts がある場合は不要。
   * root に 1 つだけ eslint.config.ts を置き files で振り分ける構成で使う。
   *
   * @example
   * // root に 1 つだけ eslint.config.ts を置く構成
   * // {
   * //   files: ["packages/website/**\/*.{ts,tsx}"],
   * //   settings: {
   * //     "better-tailwindcss": {
   * //       cwd: import.meta.dirname + "/packages/website",
   * //       entryPoint: "src/styles/globals.css",
   * //     },
   * //   },
   * // }
   */
  cwd?: string;
  /**
   * Tailwind v4 の CSS エントリーファイルへのパス。
   * 未指定だとデフォルトの tailwind クラスにフォールバックする。
   */
  entryPoint?: string;
};

/**
 * preset (base / node / nextjs) に渡す options。
 */
export type Options = {
  betterTailwindcss?: BetterTailwindcssOptions;
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
