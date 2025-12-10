// @ts-check
/**
 * Prettier options
 * {@link https://prettier.io/docs/en/options.html}
 *
 * @type {import("prettier").Config}
 */
export default {
  printWidth: 119,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  requirePragma: false,
  insertPragma: false,
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  vueIndentScriptAndStyle: false,
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto',
  singleAttributePerLine: false,

  plugins: ['prettier-plugin-packagejson'],

  overrides: [
    {
      // prettierのformatを実行したくないものを指定
      files: [
        'pnpm-lock.yaml',
        'submodules/**',
        // Next.jsがnext devの度に自動生成上書きするため
        'next-env.d.ts',
        // markdownはremarkで行う
        '*.md',
        '*.mdx',
      ],
      options: {
        requirePragma: true,
      },
    },
    {
      files: ['*.json5', '*.jsonc'],
      options: {
        parser: 'json',
      },
    },
  ],
};
