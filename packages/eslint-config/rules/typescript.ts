import { type Linter } from 'eslint';
import tseslint from 'typescript-eslint';
import { name } from '../utils/name';

/**
 * @returns typescript-eslint
 *
 * @see https://github.com/typescript-eslint/typescript-eslint
 *
 * @see https://typescript-eslint.io/rules
 */
export function typescript() {
  return tseslint.config(
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
      files: ['**/*.{ts,tsx}'],
      name: name('typescript'),
      rules: {
        /**
         * interfaceではなくtypeを使う
         *
         * @see https://typescript-eslint.io/rules/consistent-type-definitions
         */
        '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],

        // Method shorthand syntaxではなくObject property syntaxで関数の型定義する
        // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
        '@typescript-eslint/method-signature-style': ['error', 'property'],

        // Promiseをちゃんと処理する。VoidやIIFEは無視してよい。
        '@typescript-eslint/no-floating-promises': ['error', { ignoreIIFE: true, ignoreVoid: true }],

        /**
         * 使ってない引数はアンダースコア始まりにする
         *
         * @see https://typescript-eslint.io/rules/no-unused-vars
         */
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
          },
        ],
      },
    },
    {
      files: ['**/*.d.ts'],
      name: name('typescript/d.ts'),
      rules: {
        /**
         * typeではなくinterfaceを使う
         *
         * @see https://typescript-eslint.io/rules/consistent-type-definitions
         */
        '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
      },
    },
  ) as Linter.Config[];
}
