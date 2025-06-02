import { type Linter } from 'eslint';
import pluginImportX from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';
import { name } from '../utils/name';

/**
 * @returns eslint-plugin-import-x
 *
 * 次のルールはtypescriptで解決して方が良い。このルールがrecommendの半数を占めるのでrecommnendは使わずに個別に定義している
 * - 'import-x/default': 'off'
 * - 'import-x/export': 'off'
 * - 'import-x/namespace': 'off'
 * - 'import-x/no-unresolved': 'off'
 *
 * @see https://github.com/un-ts/eslint-plugin-import-x
 */
export function importX() {
  return tseslint.config({
    ...pluginImportX.flatConfigs.typescript,
    name: name('import-x'),
    rules: {
      ...pluginImportX.flatConfigs.typescript.rules,

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
       * デフォルトエクスポートの識別子としてエクスポートされた名前の使用を禁止
       *
       * @see https://github.com/un-ts/eslint-plugin-import-x/blob/HEAD/docs/rules/no-named-as-default.md
       */
      'import-x/no-named-as-default': 'warn',
    },
  }) as Linter.Config[];
}
