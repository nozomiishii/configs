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
    './rules/base',
    './rules/typescript',
    './rules/react',
    './rules/next',
    './rules/tanstack-query',
    './rules/tailwindcss',
    './rules/vitest',
    './rules/storybook',
    './rules/playwright',
    './rules/prettier',
  ].map((rules) => require.resolve(rules)),
});
