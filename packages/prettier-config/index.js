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
  embeddedLanguageFormatting: 'auto',

  plugins: ['prettier-plugin-packagejson'],

  overrides: [
    {
      files: ['pnpm-lock.yaml', 'submodules/**'],
      options: {
        requirePragma: true,
      },
    },
  ],
};
