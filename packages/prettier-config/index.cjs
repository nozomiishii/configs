// @ts-check

/**
 * Prettier options
 * {@link https://prettier.io/docs/en/options.html}
 *
 * @type {import("prettier").Options}
 */
const options = {
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
};

module.exports = options;
