import pluginImportX from "eslint-plugin-import-x";
import { defineConfig } from "eslint/config";
import { name } from "../utils/name";

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
  return defineConfig({
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/src/config/flat/typescript.ts
    ...pluginImportX.flatConfigs.typescript,
    name: name("import-x"),
    rules: {
      /**
       * 相対 import の拡張子を省略させる（js/jsx/ts/tsx 等）
       *
       * bundler 解決前提なので `.js` を書かない。base を ignorePackages にすることで
       * パッケージ import は無視しつつ、列挙していない拡張子（json / yaml / css など）は
       * 拡張子必須のまま残す。checkTypeImports で `import type` も対象にする。
       *
       * @see https://github.com/un-ts/eslint-plugin-import-x/blob/HEAD/docs/rules/extensions.md
       */
      "import-x/extensions": [
        "warn",
        "ignorePackages",
        {
          checkTypeImports: true,
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
       * 冗長なパスセグメントを禁止する（`./foo/index` → `.`、`../x/../y` など）
       *
       * noUselessIndex で `index` の明示も省かせる。
       *
       * @see https://github.com/un-ts/eslint-plugin-import-x/blob/HEAD/docs/rules/no-useless-path-segments.md
       */
      "import-x/no-useless-path-segments": ["warn", { noUselessIndex: true }],
    },
  });
}
