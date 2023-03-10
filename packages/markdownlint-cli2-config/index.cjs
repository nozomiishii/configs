module.exports = {
  fix: true,

  // https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md
  config: {
    // MD013/line-length - Line length
    MD013: false,

    // MD024 - Multiple headings with the same content
    MD024: {
      // https://github.com/DavidAnson/markdownlint/blob/v0.26.2/doc/Rules.md#md024:~:text=siblings_only%20(alternatively-,allow_different_nesting,-)%20is%20set%20to
      allow_different_nesting: true,
    },
    // MD033/no-inline-html - Inline HTML
    MD033: false,
  },

  ignores: ['**/node_modules/**'],
};
