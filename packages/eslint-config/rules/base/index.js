// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  settings: {
    'import/resolver': { node: true },
  },
  env: {
    browser: true,
    node: true,
  },
  // バチバチにルール確定したらnoInlineConfigで部分上書きできないようにしても良いかも
  // noInlineConfig: true,
  reportUnusedDisableDirectives: true,
  extends: [
    require.resolve('./airbnb'),
    require.resolve('./unicorn'),
    require.resolve('./eslint-comments'),
    require.resolve('./format'),
  ],
});
