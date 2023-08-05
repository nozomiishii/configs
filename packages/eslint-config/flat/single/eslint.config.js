import { defineFlatConfig } from 'eslint-define-config';
import globals from 'globals';
import fs from 'node:fs';
import { parse } from 'parse-gitignore';

import pluginEslintComments from 'eslint-plugin-eslint-comments';
import pluginImport from 'eslint-plugin-import';

import { rules as baseBestPracticesRules } from 'eslint-config-airbnb-base/rules/best-practices';
import { rules as baseErrorsRules } from 'eslint-config-airbnb-base/rules/errors';
import { rules as baseES6Rules } from 'eslint-config-airbnb-base/rules/es6';
import { rules as baseImportsRules } from 'eslint-config-airbnb-base/rules/imports';
import { rules as baseStyleRules } from 'eslint-config-airbnb-base/rules/style';
import { rules as baseVariablesRules } from 'eslint-config-airbnb-base/rules/variables';
import { rules as airbnbTypescript } from 'eslint-config-airbnb-typescript/lib/shared';

import pluginUnicorn from 'eslint-plugin-unicorn';

import parserTypescript from '@typescript-eslint/parser';
import pluginTypescript from '@typescript-eslint/eslint-plugin';
import pluginTsdoc from 'eslint-plugin-tsdoc';

import pluginTailwind from 'eslint-plugin-tailwindcss';

import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import styleGuideVercelReact from '@vercel/style-guide/eslint/rules/react';
import pluginNext from '@next/eslint-plugin-next';

import pluginVitest from 'eslint-plugin-vitest';
import pluginTestingLibraryReact from 'eslint-plugin-testing-library';
import configTestingLibraryReact from 'eslint-plugin-testing-library/configs/react';
import pluginPlaywright from 'eslint-plugin-playwright';
import pluginStorybook from 'eslint-plugin-storybook';

import pluginSortKeysCustomOrder from 'eslint-plugin-sort-keys-custom-order';
import configPrettier from 'eslint-config-prettier';

// ----------------------------------------------------------------
// Helper
// ----------------------------------------------------------------
const { patterns: gitignoreFiles } = parse(fs.readFileSync('.gitignore'));

// ----------------------------------------------------------------
// Config
// ----------------------------------------------------------------
/**
 * ルールをhoverするとその要約と@seeに詳細Linkが出てくる
 * Link対応してないルールは@linkで付け足してる
 *
 *
 * ルールを付け足す際は以下用に対応するのがおすすめ
 *
 * waring - fixコマンド対応してる。もしくは、ほっとくとCIで落ちる。
 * error  - 自らで直す
 */
export default defineFlatConfig([
  // ----------------------------------------------------------------
  // Target
  // ----------------------------------------------------------------
  {
    files: ['**/*.{ts,tsx,js,cjs,mjs}'],
  },
  {
    ignores: [...gitignoreFiles, '*.config.*', '*.d.ts', 'eslintRules', '.storybook'],
  },

  // ----------------------------------------------------------------
  // Base
  // ----------------------------------------------------------------
  {
    settings: {
      'import/resolver': { node: true },
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      import: pluginImport,
      unicorn: pluginUnicorn,
      'eslint-comments': pluginEslintComments,
    },
    rules: {
      ...baseBestPracticesRules,
      ...baseErrorsRules,
      ...baseES6Rules,
      ...baseImportsRules,
      ...baseStyleRules,
      ...baseVariablesRules,

      /**
       * eslint-plugin-unicorn
       * {@link https://github.com/sindresorhus/eslint-plugin-unicorn}
       */
      ...pluginUnicorn.configs.recommended.rules,

      // 略語の許容
      'unicorn/prevent-abbreviations': [
        'warn',
        {
          replacements: {
            args: {
              arguments: false,
            },
            env: {
              environment: false,
            },
            e: {
              event: false,
            },
            props: {
              properties: false,
            },
            req: {
              request: false,
            },
            res: {
              response: false,
            },
          },
        },
      ],

      /**
       * eslint-plugin-eslint-comments
       * {@link https://github.com/mysticatea/eslint-plugin-eslint-comments}
       */
      ...pluginEslintComments.configs.recommended.rules,
    },
  },

  // ----------------------------------------------------------------
  // Base - format
  // ----------------------------------------------------------------
  {
    plugins: {
      import: pluginImport,
      'sort-keys-custom-order': pluginSortKeysCustomOrder,
    },
    rules: {
      // return句の改行ルール
      'padding-line-between-statements': [
        'warn',
        {
          blankLine: 'always',
          next: 'return',
          prev: '*',
        },
      ],

      // import句の後改行する
      'import/newline-after-import': ['warn', { considerComments: true }],

      // import文の並び替え
      'import/order': [
        'warn',
        {
          alphabetize: { caseInsensitive: true, order: 'asc' },
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'object', 'type', 'index'],
          'newlines-between': 'never',
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],

      /**
       * keyを並び替え
       * {@link https://github.com/hugoattal/eslint-plugin-sort-keys-custom-order}
       */
      'sort-keys-custom-order/export-object-keys': [
        'warn',
        {
          orderedKeys: ['id', 'key', 'name', 'title', 'default'],
        },
      ],
      'sort-keys-custom-order/import-object-keys': [
        'warn',
        {
          orderedKeys: ['id', 'key', 'name', 'title', 'default'],
        },
      ],
      'sort-keys-custom-order/object-keys': [
        'warn',
        {
          orderedKeys: ['id', 'key', 'name', 'title', 'default'],
        },
      ],
      'sort-keys-custom-order/type-keys': [
        'warn',
        {
          orderedKeys: ['id', 'key', 'name', 'title', 'default'],
        },
      ],
    },
  },

  // ----------------------------------------------------------------
  // TypeScript
  // ----------------------------------------------------------------
  {
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
    languageOptions: {
      parser: parserTypescript,
      parserOptions: {
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      import: pluginImport,
      '@typescript-eslint': pluginTypescript,
      tsdoc: pluginTsdoc,
    },
    rules: {
      ...airbnbTypescript,
      ...pluginTypescript.configs['eslint-recommended'].rules,
      ...pluginTypescript.configs['recommended'].rules,
      ...pluginTypescript.configs['recommended-requiring-type-checking'].rules,
      ...pluginTypescript.configs['strict'].rules,

      // シャドウイングの許容
      '@typescript-eslint/no-shadow': 'off',

      // 使ってない引数はアンダースコア始まりにする
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],

      // interfaceではなくtypeを使う
      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],

      // EnumではなくUnion typeを使う
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message: "Don't use enums. Use Union type instead.",
        },
      ],

      /**
       * tsdocのsyntaxチェック
       * {@link https://tsdoc.org/pages/packages/eslint-plugin-tsdoc/}
       */
      'tsdoc/syntax': 'error',
    },
  },

  // ----------------------------------------------------------------
  // React
  // ----------------------------------------------------------------
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      globals: {
        React: true,
        JSX: true,
      },
    },
    plugins: {
      'jsx-a11y': pluginJsxA11y,
      react: pluginReact,
      'react-hooks': pluginReactHooks,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs['jsx-runtime'].rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,

      ...styleGuideVercelReact.rules,
    },
  },

  // ----------------------------------------------------------------
  // Next.js
  // ----------------------------------------------------------------
  /** {@link https://github.com/vercel/next.js/tree/canary/packages/eslint-plugin-next} */
  {
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },

  // ----------------------------------------------------------------
  // TailwindCSS
  // ----------------------------------------------------------------
  /** {@link https://github.com/francoismassart/eslint-plugin-tailwindcss} */
  {
    plugins: {
      tailwindcss: pluginTailwind,
    },
    rules: pluginTailwind.configs.recommended.rules,
  },

  // ----------------------------------------------------------------
  // Test tools
  // ----------------------------------------------------------------
  {
    files: ['**/*.test.ts', '**/e2e/**', '**/*.stories.ts'],
    plugins: {
      import: pluginImport,
    },
    rules: {
      // Test toolsはdevDependenciesでもいい
      'import/no-extraneous-dependencies': 'off',
    },
  },

  // ----------------------------------------------------------------
  // Vitest
  // ----------------------------------------------------------------
  /** {@link https://github.com/veritem/eslint-plugin-vitest} */
  {
    files: ['**/*.test.ts'],
    ignores: ['**/e2e/**'],
    plugins: {
      vitest: pluginVitest,
    },
    rules: {
      // ファイル名.*\.test\.[tj]sx?$にする
      'vitest/consistent-test-filename': 'error',

      // itでなくtest句でテスト書く
      'vitest/consistent-test-it': ['warn', { fn: 'test' }],

      // expectは忘れずに
      'vitest/expect-expect': 'error',

      // 同一テスト内で複数expectやめる
      'vitest/max-expects': ['error', { max: 1 }],

      // describeのネストやめる
      'vitest/max-nested-describe': ['error', { max: 1 }],

      // aliasメソッドは揺れるからやめる
      'vitest/no-alias-methods': 'warn',

      // testケースコメントアウトしたままにしないで
      'vitest/no-commented-out-tests': process.env.CI ? 'error' : 'warn',

      // 条件分岐させたexpectやめる
      'vitest/no-conditional-expect': 'error',

      // テスト句の中で条件分岐しない
      'vitest/no-conditional-in-test': 'error',

      // テスト自体を実行させるかどうか条件分岐しない
      'vitest/no-conditional-tests': 'error',

      // test.skip残しとかない
      'vitest/no-disabled-tests': process.env.CI ? 'error' : 'warn',

      // callbackの非同期処理ちゃんとする
      'vitest/no-done-callback': 'error',

      // test hookの重複やめる
      'vitest/no-duplicate-hooks': 'error',

      // test.only残しとかない
      'vitest/no-focused-tests': process.env.CI ? 'error' : 'warn',

      // beforeAll, beforeEach, afterAll, afterEachの禁止
      // 'vitest/no-hooks': 'error',

      // 重複したテスト名禁止
      'vitest/no-identical-title': 'error',

      // スナップショットテストで文字列補間しない
      // 'vitest/no-interpolation-in-snapshots': 'error',

      // でかいスナップショットテストだめ
      // 'vitest/no-large-snapshots': 'error',

      // __mocks__ directory禁止
      'vitest/no-mocks-import': 'error',

      // 使ってほしくないmatcherの設定
      // 'vitest/no-restricted-matchers': [
      //   'error',
      //   {
      //     not: null,
      //   },
      // ],

      // 使ってほしくないviメソッドの設定
      // 'vitest/no-restricted-vi-methods': [
      //   'error',
      //   {
      //     advanceTimersByTime: null,
      //     spyOn: "Don't use spies",
      //   },
      // ],

      // testブロックの外でexpectしない
      'vitest/no-standalone-expect': ['error', { additionalTestBlockFunctions: ['test'] }],

      // prefixのついたtest句使わない
      'vitest/no-test-prefixes': 'warn',

      // テスト句returnしない
      'vitest/no-test-return-statement': 'error',

      // toBeCalledWithやtoHaveBeenCalledWithの方を使う
      'vitest/prefer-called-with': 'error',

      // comparison-matcherを使う
      'vitest/prefer-comparison-matcher': 'warn',

      // loopはfor文じゃなくてeachする
      'vitest/prefer-each': 'error',

      // quality matchersを使う
      'vitest/prefer-equality-matcher': 'error',

      // 非同期はexpect句の外でawaitする
      'vitest/prefer-expect-resolves': 'warn',

      // 'beforeAll', 'beforeEach', 'afterEach', 'afterAll'の順で書く
      'vitest/prefer-hooks-in-order': 'error',

      // hooksは上部にまとめて定義する
      'vitest/prefer-hooks-on-top': 'error',

      // テストtitleは小文字始まり
      'vitest/prefer-lowercase-title': 'error',

      // mock promise冗長に書かない
      'vitest/prefer-mock-promise-shorthand': 'warn',

      // snapshotテストではhintsを使う
      // 'vitest/prefer-snapshot-hint': 'error',

      // vi.spyOnできるとこはspyOnする
      'vitest/prefer-spy-on': 'warn',

      // toEqualでなくtoStrictEqual使う
      'vitest/prefer-strict-equal': 'error',

      // toEqualでなくtoBe使う
      'vitest/prefer-to-be': 'warn',

      // toBe(false)でなくtoBeFalsy()使う
      'vitest/prefer-to-be-falsy': 'warn',

      // toBeInstanceOf(Object)でなくtoBeObject()使う
      'vitest/prefer-to-be-object': 'warn',

      // toBe(true)でなくtoBeTruthy()使う
      'vitest/prefer-to-be-truthy': 'warn',

      // expect(a.includes(b)).toBe(true)みたいにせずtoContain()使う
      'vitest/prefer-to-contain': 'warn',

      // expect(files.length).toStrictEqual(1)みたいにせずtoHaveLength()使う
      'vitest/prefer-to-have-length': 'warn',

      // 書きかけのテストはtest.todo()にする
      'vitest/prefer-todo': 'warn',

      // setupやteardownはhookの中に書く
      'vitest/require-hook': 'error',

      // throw時にはエラーメッセージ書く
      'vitest/require-to-throw-message': 'error',

      // describe内にテスト書く
      'vitest/require-top-level-describe': 'error',

      // describeでは非同期処理しない
      'vitest/valid-describe-callback': 'error',

      // expect関数をハックしない
      'vitest/valid-expect': 'error',

      // テストタイトルちゃんと書く
      'vitest/valid-title': 'error',
    },
  },

  // ----------------------------------------------------------------
  // testing-library
  // ----------------------------------------------------------------
  /** {@link https://github.com/testing-library/eslint-plugin-testing-library} */
  {
    files: ['**/*.test.ts', '**/*.stories.ts'],
    ignores: ['**/e2e/**'],
    plugins: {
      'testing-library': pluginTestingLibraryReact,
    },
    rules: {
      ...configTestingLibraryReact.rules,
    },
  },

  // ----------------------------------------------------------------
  // playwright
  // ----------------------------------------------------------------
  /** {@link https://github.com/playwright-community/eslint-plugin-playwright} */
  {
    files: ['**/e2e/**'],
    plugins: {
      playwright: pluginPlaywright,
    },
    rules: {
      ...pluginPlaywright.configs['playwright-test'].rules,

      /**
       * テストタイトルは小文字からはじめる
       * {@link https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/prefer-lowercase-title.md}
       */
      'playwright/prefer-lowercase-title': 'warn',

      /**
       * toBeでいけるところはtoBe
       * {@link https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/prefer-to-be.md}
       */
      'playwright/prefer-to-be': 'warn',

      /**
       * toHaveLengthでいけるところはtoHaveLength
       * {@link https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/prefer-to-have-length.md}
       */
      'playwright/prefer-to-have-length': 'warn',

      /**
       * describe内にテスト書く
       * {@link https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/require-top-level-describe.md}
       */
      'playwright/require-top-level-describe': 'error',
    },
  },

  // ----------------------------------------------------------------
  // storybook
  // ----------------------------------------------------------------
  /** {@link https://github.com/storybookjs/eslint-plugin-storybook} */
  {
    files: ['**/*.stories.*', '**/.storybook/main.*'],
    plugins: {
      storybook: pluginStorybook,
    },
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

  // ----------------------------------------------------------------
  // prettier
  // ----------------------------------------------------------------
  /** {@link https://github.com/prettier/eslint-config-prettier} */
  {
    rules: configPrettier.rules,
  },
]);
