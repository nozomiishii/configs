// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    /**
     * eslint-plugin-react
     * {@link https://www.npmjs.com/package/eslint-plugin-react}
     */
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',

    /**
     * eslint-plugin-react-hooks
     * {@link https://www.npmjs.com/package/eslint-plugin-react-hooks}
     */
    'plugin:react-hooks/recommended',

    /**
     * eslint-plugin-jsx-a11y
     * {@link https://www.npmjs.com/package/eslint-plugin-jsx-a11y}
     */
    'plugin:jsx-a11y/recommended',

    /**
     * @vercel/style-guide
     * {@link https://www.npmjs.com/package/@vercel/style-guide}
     */
    require.resolve('@vercel/style-guide/eslint/react'),
  ],
});
