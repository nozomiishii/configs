# トラブルシューティング

lint エラーで詰まった時の進め方と、よくある対応パターンをまとめる。

## 原則

- off にするのは最終手段かつ必ずプロジェクトリーダーが決める。
- 実装者が行うのはコードの修正まで。rule の設定変更の判断はリーダーが行う。

## エラーの解決手順

- まずコードを直す。lint が通り、読みやすさも保てるなら完了。
- 直すと読みにくくなると思ったら、いったん止める。直したコードと対象 rule の公式ドキュメント URL を添えて、プロジェクトリーダーの判断を仰ぐ。方針が出るまでその rule の修正には手をつけない。
- 相談で決めた方針を、次の優先順で対応する。
  - shared config `@nozomiishii/eslint-config` を直す。全 consumer に効く根本対応。<https://github.com/nozomiishii/configs/issues/new> に issue を出す。
  - プロジェクトの `project/overrides` で、プロジェクト全体の統一ルールとして options を調整する。
  - `files` で対象を絞り、特定のファイルだけ options を緩める、もしくは off にする。

## よくある対応パターン

リーダーから指示があった場合の対応例。

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
