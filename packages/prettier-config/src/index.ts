import type { Config } from 'prettier';

/**
 * Prettier options
 * {@link https://prettier.io/docs/en/options.html}
 */
export default {
  // 1 行あたりの文字数。Github のコードレビュー画面の幅に合わせて広めに取っている (default は 80)
  printWidth: 119,

  // Prettier default タブ幅は 2 スペース
  tabWidth: 2,

  // Prettier default インデントを space で出力
  useTabs: false,

  // Prettier default 文末にセミコロンを付ける
  semi: true,

  // Prettier default ダブルクォートを使う (apostrophe を含む string と混在しにくく、Prettier の escape 最少優先 logic とも整合)
  singleQuote: false,

  // Prettier default 必要なときだけプロパティ名をクオート
  quoteProps: 'as-needed',

  // Prettier default JSX 属性はダブルクォート (HTML 慣習)
  jsxSingleQuote: false,

  // Prettier default 関数引数や型パラメータも含め可能な限り末尾カンマを付ける
  trailingComma: 'all',

  // Prettier default オブジェクトリテラルの { 直後と } 直前にスペース ({ a } 形式)
  bracketSpacing: true,

  // Prettier default 複数行の HTML/JSX で閉じ > を次行に置く (旧 jsxBracketSameLine と同等)
  bracketSameLine: false,

  // Prettier default アロー関数の引数が 1 つでも括弧を付ける
  arrowParens: 'always',

  // Prettier default pragma が無くても全ファイルを format
  requirePragma: false,

  // Prettier default format したファイルに pragma を自動挿入しない
  insertPragma: false,

  // Prettier default Markdown の改行・折り返しを元の状態のまま保つ
  proseWrap: 'preserve',

  // Prettier default CSS の display 値で HTML 内空白の扱いを判定
  htmlWhitespaceSensitivity: 'css',

  // Prettier default Vue SFC の <script>/<style> 内をインデントしない
  vueIndentScriptAndStyle: false,

  // Prettier default 改行コードは LF
  endOfLine: 'lf',

  // Prettier default template literal 等の埋め込み言語も format
  embeddedLanguageFormatting: 'auto',

  // Prettier default HTML/JSX 属性を 1 行ずつにしない
  singleAttributePerLine: false,

  // Prettier default 複数行に分かれたオブジェクトの改行スタイルを保つ
  objectWrap: 'preserve',

  plugins: ['prettier-plugin-packagejson'],

  overrides: [
    {
      // prettier の format を実行したくないものを指定
      files: [
        'pnpm-lock.yaml',
        'submodules/**',
        // Next.js が next dev のたびに自動生成上書きするため
        'next-env.d.ts',
        // markdown は remark で行う
        '*.md',
        '*.mdx',
      ],
      options: {
        requirePragma: true,
      },
    },
    {
      // JSONC / JSON5 は native parser に委ねコメント等の言語機能を保つ。
      // ただし VSCode の JSONC モードは trailing comma を allowed-but-discouraged 扱いで warning を出す
      // ({@link https://code.visualstudio.com/docs/languages/json}) ため、自動付与は止める
      files: ['*.json5', '*.jsonc'],
      options: {
        trailingComma: 'none',
      },
    },
  ],
} satisfies Config;
