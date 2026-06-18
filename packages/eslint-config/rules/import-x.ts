import pluginImportX from "eslint-plugin-import-x";
import { defineConfig } from "eslint/config";
import { name } from "../utils/name";

/**
 * @returns eslint-plugin-import-x
 *
 * TypeScriptに任せた方がいいルール
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
  return defineConfig({
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/src/config/flat/typescript.ts
    ...pluginImportX.flatConfigs.typescript,
    name: name("import-x"),
    rules: {
      /**
       * 拡張子を省略できるもの（js/ts 系）は省略する。JSON などは維持。
       *
       * @see https://github.com/un-ts/eslint-plugin-import-x/blob/HEAD/docs/rules/extensions.md
       */
      "import-x/extensions": [
        "warn",
        "ignorePackages",
        {
          checkTypeImports: true,
          fix: true,
          pattern: {
            cjs: "never",
            cts: "never",
            js: "never",
            jsx: "never",
            mjs: "never",
            mts: "never",
            ts: "never",
            tsx: "never",
          },
        },
      ],

      /**
       * import文は先頭に書く
       *
       * @see https://github.com/un-ts/eslint-plugin-import-x/blob/HEAD/docs/rules/first.md
       */
      "import-x/first": "warn",

      /**
       * 循環依存を禁止
       *
       * @see https://github.com/un-ts/eslint-plugin-import-x/blob/HEAD/docs/rules/no-cycle.md
       */
      "import-x/no-cycle": "warn",

      /**
       * 同じモジュールの繰り返しインポートを禁止
       *
       * @see https://github.com/un-ts/eslint-plugin-import-x/blob/HEAD/docs/rules/no-duplicates.md
       */
      "import-x/no-duplicates": "warn",

      /**
       * default import名がモジュールのnamed export名と一致することを禁止
       *
       * @see https://github.com/un-ts/eslint-plugin-import-x/blob/HEAD/docs/rules/no-named-as-default.md
       */
      "import-x/no-named-as-default": "warn",

      /**
       * 冗長なパスセグメントを禁止。noUselessIndex で `index` も省く。
       *
       * @see https://github.com/un-ts/eslint-plugin-import-x/blob/HEAD/docs/rules/no-useless-path-segments.md
       */
      "import-x/no-useless-path-segments": ["warn", { noUselessIndex: true }],
    },
  });
}
