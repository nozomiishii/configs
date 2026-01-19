/**
 * markdownlint
 * {@link https://github.com/DavidAnson/markdownlint}
 */
module.exports = {
  /**
   * Rules
   * {@link https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md}
   */
  config: {
    /**
     * MD004 - Unordered list style
     * {@link https://github.com/DavidAnson/markdownlint/blob/main/doc/md004.md}
     */
    MD004: {
      style: 'dash',
    },

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
      siblings_only: true,
    },

    /**
     * MD033 - Inline HTML
     * {@link https://github.com/DavidAnson/markdownlint/blob/main/doc/md033.md}
     */
    MD033: false,
  },

  ignores: ['**/node_modules', '**/submodules', 'LICENSE', '.git'],
};
