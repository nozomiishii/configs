---
status: accepted
date: 2026-09-05
---

# import の拡張子は lint で強制しない

## 背景と課題

`import-x/extensions` を `never` (js / ts 系は省略、asset は明記) で有効にしていた。TanStack Start + Vite の pilot repo で、Paraglide JS が `emitTsDeclarations` で出す `.js` + `.d.ts` ペアへの相対 import が、拡張子を付けても外しても警告になり、コードでは解消できなくなった。

rule は import が `.d.ts` に解決されたときだけ判定基準を specifier 文字列側に切り替える実装で、npm パッケージへの import には救済分岐があるが相対 import には無い。`.js` + `.d.ts` ペアの扱いは [Biome の同種 rule でも未解決の issue](https://github.com/biomejs/biome/issues/8893)があり、import-x 自身も [`.d.ts` 対応を入れた直後に回帰](https://github.com/un-ts/eslint-plugin-import-x/issues/497)している。

## 検討した選択肢

| 選択肢 | 評価 |
| --- | --- |
| rule を残し、`pattern` に空文字キー `"": "never"` を足す | 動くが、スキーマがキーを制限していない隙間を突く undocumented な回避 |
| rule を残し、`pathGroupOverrides` で生成物ディレクトリを除外する | `patternOptions` に `dot: true` を渡せば動く。プロジェクト固有のディレクトリ名を shared config に持ち込むことになる |
| rule を残し、resolver の拡張子解決順を `.js` 優先にする | 実測では `.js` 付きも拡張子なしも通り、検査自体が消える |
| `js: "always"` に方針転換する | ディレクトリ import の autofix が[実在しないパスを書く](https://github.com/un-ts/eslint-plugin-import-x/issues/413)。全 consumer の `.js` 実体 import に影響する |
| rule を削除する | `.ts` 付きは tsc が止め (TS5097)、残るリスクは手書きやコピペで混入する `.js` 付きだけ |
| `n/file-extension-in-import` に置き換える | `["warn", "always", { ".js": "never", ".ts": "never", ... }]` で pilot repo を実測。`.js` + `.d.ts` ペアと `?url` を通し、`.ts` への `.js` 付きも捕捉する。有名プリセットでの採用状況は調査中 |
| `no-restricted-syntax` の selector で `.js` 付きだけ禁止する | 純 AST 判定で resolver を使わない。typescript-eslint が [`import/extensions` の軽い代替として案内](https://typescript-eslint.io/troubleshooting/typed-linting/performance/)している |

## 決定

`import-x/extensions` を削除する。置き換えは保留した論点の調査結果を見て決める。

前提の調査結果:

- antfu、sxzz、@nuxt、eslint-config-next、SvelteKit、@epic-web はこの rule を有効にしていない。有効なのは airbnb 系のみ
- eslint-config-xo は「`.ts` ソースに `.js` と書く TS の慣行をこの rule がモデル化できない」として、[TypeScript では off にしている](https://github.com/xojs/eslint-config-xo/issues/119)
- `bundler` 構成の repo では拡張子なしが最多で、`.ts` 付きは tsc が止める

各パッケージの `bin/**/*.js` に対する `["warn", "ignorePackages"]` の上書きは残す。Node が直接実行する bin は `.js` 付きが必須で、この用途では rule が正しく動く。

## 結果

### 良くなったこと

`.js` + `.d.ts` ペアを出すツールを使っても lint が詰まらない。

### 引き受けたコスト

コピペで混入した `.js` 付き import は autofix されず、review で拾う。

### 保留した論点

- `n/file-extension-in-import` へ置き換えるか。有名プリセットの採用状況を調べてから決める
- import-x 側の [autofix の不具合](https://github.com/un-ts/eslint-plugin-import-x/issues/413)が直ったら、rule を戻す余地を再評価する
