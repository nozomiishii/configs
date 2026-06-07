# トラブルシューティング

lint エラーで詰まった時の進め方と、よくある対応パターンをまとめる。

## エラーの解決手順

off にするのは最後の手段。まずコードを直し、可読性が落ちる時だけ rule の調整を考える。

直す人（人間でも AI でも）は次の順で進める。

- まずコードを直す。lint が通り、読みやすさも保てるなら完了。
- 直すと読みにくくなるなら、いったん止める。直した diff と、その rule の options を公式ドキュメントで確認して並べて見せ、どうするか相談する。
  - 「可読性が落ちるか」に数値の基準は設けていない。直す人の判断でよく、迷ったら直した diff を見せて相談する。
- 相談で決めた方針を、次の優先順で対応する。上ほど根本的で、下ほど最終手段。
  - shared config `@nozomiishii/eslint-config` を直す。全 consumer に効く根本対応。<https://github.com/nozomiishii/configs/issues/new> に issue を出す。
  - このプロジェクトの `project/overrides` で、プロジェクト全体の統一ルールとして options を調整する。
  - 最終手段。`files` で対象を絞り、特定のファイルだけ options を緩める / off にする。

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
