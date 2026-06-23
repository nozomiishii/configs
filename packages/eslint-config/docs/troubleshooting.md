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

### n/no-process-exit, unicorn/no-process-exit

`process.exit()` はその場でプロセスを殺す。未完了の I/O が切り捨てられ、ライブラリとして呼ばれた場合は呼び出し元もろとも落とす。

`process.exitCode` に変える。全処理の完了を待ってから終了するので安全。

```ts
// NG
process.stdout.write("結果を表示\n");
process.exit(0);
// ↑ stdout がフラッシュされる前にプロセスが死ぬことがある

// OK
process.exitCode = 1;
```

@see <https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-process-exit.md>

### no-console

`console.log` はデバッグの残骸か意図的な出力か、コードを読むだけでは判断できない。意図的な出力には `process.stdout.write` / `process.stderr.write` やログライブラリを使う。こうすると `console.log` が残っていれば消し忘れだと即座に分かる。

```ts
// NG
console.log("結果を表示");
console.error("エラーが発生しました");

// OK
process.stdout.write("結果を表示\n");
process.stderr.write("エラーが発生しました\n");
```

@see <https://eslint.org/docs/latest/rules/no-console>
