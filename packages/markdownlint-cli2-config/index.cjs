/**
 * markdownlint
 * {@link https://github.com/DavidAnson/markdownlint}
 */
module.exports = {
  fix: !process.env.CI,

  /**
   * Rules
   * {@link https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md}
   */
  config: {
    /**
     * MD013 - Line length
     * {@link https://github.com/DavidAnson/markdownlint/blob/main/doc/md013.md}
     */
    MD013: false,

    /**
     * MD024 - Multiple headings with the same content
     * {@link https://github.com/DavidAnson/markdownlint/blob/main/doc/md024.md}
     */
    MD024: {
      allow_different_nesting: true,
    },

    /**
     * MD033/no-inline-html - Inline HTML
     * {@link https://github.com/DavidAnson/markdownlint/blob/main/doc/md033.md}
     */
    MD033: false,
  },

  ignores: ['**/node_modules/**'],
};
