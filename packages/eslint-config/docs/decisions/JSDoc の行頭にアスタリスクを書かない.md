---
status: accepted
date: 2026-10-20
---

# JSDoc の行頭にアスタリスクを書かない

## 背景と課題

eslint-plugin-unicorn 77.0.0 で `unicorn/no-asterisk-prefix-in-documentation-comments` が recommended に入った。recommended を展開しているので、JSDoc の行頭の `*` が全部エラーになる。

jsdoc の設定が効く `lib/`・`utils/` などの中では、`jsdoc/check-alignment` と自動修正がループする。

```text
       unicorn が * を消す   jsdoc が空白を足す
/**          →          /**         →        /**
 * 説明                 説明                   説明
 */                     */                     */
                ↑                                │
                └────── unicorn がまた消す ───────┘
```

## 検討した選択肢

```ts
// unicorn のルールを off にして * を残す
"unicorn/no-asterisk-prefix-in-documentation-comments": "off",
```

```ts
// unicorn のルールに合わせ、jsdoc 側を変える
"jsdoc/check-alignment": "off",
"jsdoc/no-multi-asterisks": ["warn", { preventAtMiddleLines: false }],
"jsdoc/require-asterisk-prefix": ["warn", "never"],
```

| 選択肢 | 評価 |
| --- | --- |
| unicorn のルールを off にして `*` を残す | 利用側の書き換えは要らない。エディタの `/**` 補完どおりに書ける |
| unicorn のルールに合わせ、jsdoc 側を変える | コメントをコピペしやすい。eslint-config-xo と同じ組み合わせ |

## 決定

jsdoc 側の 3 つのルールを変える。

- `jsdoc/check-alignment` を off にする
- `jsdoc/no-multi-asterisks` は、行頭の `**` を prefix と誤認しないよう `preventAtMiddleLines: false` にする
- `jsdoc/require-asterisk-prefix` は、jsdoc の自動修正が足す `*` を消すため `"never"` にする

## 結果

### 良くなったこと

JSDoc を書くとき、行ごとに `*` を書かなくてよい。

### 引き受けたコスト

- この config を使う repo は、更新すると既存の JSDoc がエラーになる。`eslint --fix` を、エラーが消えるまで繰り返して直す
- VS Code のホバーでは、行頭の字下げが消える。`@example` のコード例が平らに表示される
- 行頭の `*` と空白は TypeScript が prefix とみなして消すので、Markdown の箇条書きは `-` で書く
- 行頭の `**太字**` は、`require-asterisk-prefix` と TypeScript のホバーの両方で壊れる。太字は使わない運用で避ける

### 保留した論点

なし
