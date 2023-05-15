// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  overrides: [
    {
      files: ['**/*.test.ts'],
      excludedFiles: '**/e2e/**',
      plugins: [
        /**
         * eslint-plugin-vitest
         * {@link https://www.npmjs.com/package/eslint-plugin-vitest}
         */
        'vitest',
      ],
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
  ],
});
