# トラブルシューティング

lint エラーで詰まった時の進め方と、よくある対応パターンをまとめる。

## エラーの解決手順

off で消すのは最後の手段。まずコードの修正を試し、可読性が落ちる時だけ rule の調整を検討する。

- コードを直す。lint が通り読みやすさも保てるなら、それで終わり。
- 直した結果を diff で見せ、可読性が落ちていないか確認してもらう。
- 直すと可読性が落ちると判断したら、その rule の options を公式ドキュメントで探す。
- diff と見つけた options を並べて提示し、どれにするか判断を仰ぐ。
  - shared config `@nozomiishii/eslint-config` に options で緩める issue を出す
  - プロジェクトの `project/overrides` で options を緩める
  - `files` で対象を絞る
  - off にする

可読性が落ちるかの基準は決めていない。今は各自の判断に委ねる。

## よくある対応パターン

### n/no-process-env

`process.env` の直接参照を禁止する。子プロセスへ渡すなど一部の変数だけ通したい時は、off ではなく `allowedVariables` で必要な変数だけ許可する。

```ts
{
  name: "project/overrides",
  rules: {
    "n/no-process-env": ["error", { allowedVariables: ["HOME", "PATH"] }],
  },
}
```

@see <https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-process-env.md>
