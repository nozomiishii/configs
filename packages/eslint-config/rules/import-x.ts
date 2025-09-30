import { type Linter } from 'eslint';
import pluginImportX from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';
import { name } from '../utils/name';

/**
 * @returns eslint-plugin-import-x
 *
 * typescriptに任せた方がいいルール
 * https://typescript-eslint.io/troubleshooting/typed-linting/performance/#eslint-plugin-import
 * ```
 * import/named
 * import/namespace
 * import/default
 * import/no-named-as-default-member
 * import/no-unresolved
 * ```
 *
 * @see https://github.com/un-ts/eslint-plugin-import-x
 */
export function importX() {
  // tseslint.configがdefineConfigに移行した差分が取り込まれてない
  // https://github.com/un-ts/eslint-plugin-import-x/issues/421
  //
  // antfuさんも使ってるし
  // こっちにかえようかな import-x/no-cycleがないのが悩み
  // https://github.com/9romise/eslint-plugin-import-lite
  //
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  return tseslint.config({
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/src/config/flat/typescript.ts
    ...pluginImportX.flatConfigs.typescript,
    name: name('import-x'),
    rules: {
      /**
       * import文は先頭に書く
       *
       * @see https://github.com/un-ts/eslint-plugin-import-x/blob/HEAD/docs/rules/first.md
       */
      'import-x/first': 'warn',

      /**
       * 循環依存を禁止
       *
       * @see https://github.com/un-ts/eslint-plugin-import-x/blob/HEAD/docs/rules/no-cycle.md
       */
      'import-x/no-cycle': 'warn',

      /**
       * 同じモジュールの繰り返しインポートを禁止
       *
       * @see https://github.com/un-ts/eslint-plugin-import-x/blob/HEAD/docs/rules/no-duplicates.md
       */
      'import-x/no-duplicates': 'warn',

      /**
       * default import名がモジュールのnamed export名と一致することを禁止
       *
       * @see https://github.com/un-ts/eslint-plugin-import-x/blob/HEAD/docs/rules/no-named-as-default.md
       */
      'import-x/no-named-as-default': 'warn',

      /**
       * 使ってないモジュールを禁止
       *
       * @see https://github.com/un-ts/eslint-plugin-import-x/blob/HEAD/docs/rules/no-unused-modules.md
       */
      'import-x/no-unused-modules': 'warn',
    },
  }) as Linter.Config[];
}
