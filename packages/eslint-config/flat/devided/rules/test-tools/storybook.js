// FIXME: pluginsもrulesもflat-config未対応、対応後@ts-checkを有効にする
import { defineFlatConfig } from 'eslint-define-config';
import * as pluginStorybook from 'eslint-plugin-storybook';

/**
 * {@link https://github.com/storybookjs/eslint-plugin-storybook}
 */
export default defineFlatConfig([
  {
    files: ['**/*.stories.*', '**/.storybook/main.*'],
    plugins: {
      storybook: pluginStorybook,
    },
    // FIXME: override使ってrulesを定義してたので直書き。flat-config対応したらrecommendedとcsf-strictつかう
    rules: {
      /**
       * Interactionsはawaitする
       * {@link https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/await-interactions.md}
       */
      'storybook/await-interactions': 'warn',

      /**
       * play functionでのcontext渡し忘れ防止
       * {@link https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/context-in-play-function.md}
       */
      'storybook/context-in-play-function': 'error',

      /**
       * metaにcomponent渡し忘れ防止
       * {@link https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/csf-component.md}
       */
      'storybook/csf-component': 'error',

      /**
       * metaのdefault export忘れ防止
       * {@link https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/default-exports.md}
       */
      'storybook/default-exports': 'warn',

      /**
       * 非推奨のhierarchy separatorを使わない
       * {@link https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/hierarchy-separator.md}
       */
      'storybook/hierarchy-separator': 'warn',

      /**
       * 冗長なnameプロパティは消す
       * {@link https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/no-redundant-story-name.md}
       */
      'storybook/no-redundant-story-name': 'warn',

      /**
       * 非推奨のstoriesOfを使わない
       * {@link https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/no-stories-of.md}
       */
      'storybook/no-stories-of': 'error',

      /**
       * MetaのtitleはCSF 3.0から自動付与になったのでいらない
       * {@link https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/no-title-property-in-meta.md}
       */
      'storybook/no-title-property-in-meta': 'warn',

      /**
       * addonsの消し忘れ入れ忘れ
       * {@link https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/no-uninstalled-addons.md}
       */
      'storybook/no-uninstalled-addons': 'error',

      /**
       * story名はpascalケース
       * {@link https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/prefer-pascal-case.md}
       */
      'storybook/prefer-pascal-case': 'warn',

      /**
       * metaはdefault export。storyはnamed export
       * {@link https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/story-exports.md}
       */
      'storybook/story-exports': 'error',

      /**
       * jestじゃなくて@storybook/jest使う
       * {@link https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/use-storybook-expect.md}
       */
      'storybook/use-storybook-expect': 'warn',

      /**
       * testing-libraryじゃなくて@storybook/testing-library使う
       * {@link https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/use-storybook-testing-library.md}
       */
      'storybook/use-storybook-testing-library': 'warn',
    },
  },
]);
