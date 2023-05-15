// @ts-check
const { defineConfig } = require('eslint-define-config');

/**
 * ルールをhoverするとその要約と@seeに詳細Linkが出てくる
 * Link対応してないルールは@linkで付け足してる
 *
 *
 * ルールを付け足す際は以下ように対応する
 *
 * waring - fixコマンド対応してる。もしくは、ほっとくとCIで落ちるもの。
 * error  - 自らで直すもの
 */
module.exports = defineConfig({
  extends: [
    require.resolve('./rules/base'),
    require.resolve('./rules/typescript'),
    require.resolve('./rules/react'),
    require.resolve('./rules/next'),
    require.resolve('./rules/tailwindcss'),
    require.resolve('./rules/test-tools'),
    require.resolve('./rules/prettier'),
  ],
});
