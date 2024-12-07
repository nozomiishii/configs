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
     * eslint-plugin-react-compiler
     * {@link https://github.com/facebook/react/tree/main/compiler/packages/eslint-plugin-react-compiler}
     */
    'react-compiler',

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
  rules: {
    /**
     * Reactで”&&”で分岐した際、うっかり「0」を表示しないようにする
     * {@link https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-leaked-render.md}
     *
     * validStrategiesのcoerceとternaryの違い
     * https://chatgpt.com/share/67356362-f738-8007-9b93-6164fb55340f
     *
     * 人によって a ? b : nullって書くか!!a && b って書くか揺れないようにcoerceにしてる
     */
    'react/jsx-no-leaked-render': ['warn', { validStrategies: ['coerce'] }],

    /**
     * https://react.dev/learn/react-compiler
     */
    'react-compiler/react-compiler': 'error',
  },
});
