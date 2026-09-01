# トラブルシューティング

lint エラーで詰まった時の進め方と、よくある対応パターンをまとめる。

## 原則

- off にするのは最終手段かつ必ずプロジェクトリーダーが決める。
- 実装者が行うのはコードの修正まで。rule の設定変更の判断はリーダーが行う。

## エラーの解決手順

- auto fix で直る違反は auto fix で直す。
- 対象 rule の公式ドキュメントにある修正パターンどおりに直す。
- [よくある対応パターン](#よくある対応パターン)に該当すれば、それに合わせる。
- どれでも直せない、または直すと読みにくくなるときは、直したコード案と対象 rule の公式ドキュメント URL を添えて、プロジェクトリーダーの判断を仰ぐ。方針が出るまでその rule の修正には手をつけない。
- 相談で決めた方針を、次の優先順で対応する。
  - shared config `@nozomiishii/eslint-config` を直す。全 consumer に効く根本対応。<https://github.com/nozomiishii/configs/issues/new> に issue を出す。
  - プロジェクトの `project/overrides` で、プロジェクト全体の統一ルールとして options を調整する。
  - `files` で対象を絞り、特定のファイルだけ options を緩める、もしくは off にする。

## よくある対応パターン

リーダーが事前に承認済みの対応。個別相談は不要。

### @typescript-eslint/consistent-type-definitions

オブジェクトリテラルの type 宣言は interface に直す。`lint:fix` で一括変換し、続けて `format:fix` を実行する。fixer の出力は 1 行 interface になり、そのままでは format check に落ちる。

変換で挙動が変わる箇所が 2 つある。1 つ目は index signature を要求する引数。

```ts
declare function send(data: Record<string, unknown>): void;
declare const props: Props;

interface Props {
  locale: string;
}

// NG: type Props = { locale: string } だった間は通っていたが、変換後は型エラー
send(props);

// OK: 複製して渡す。interface に index signature を足すのでもよい
send({ ...props });
```

2 つ目は declare global。fixer は declare global 内の type も変換し、global の interface は同名宣言と merge される。

```ts
declare global {
  // NG: fix 後に interface Session になり、同名の global 宣言と暗黙に merge される
  type Session = { user: string };
}
```

変換 diff に declare global があれば、意図した merge か確認する。

@see <https://typescript-eslint.io/rules/consistent-type-definitions/>

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

### n/no-unsupported-features/node-builtins

package.json に Node.js のバージョン指定が無いと対象の Node.js が `>=16.0.0` 扱いになり、`Request` / `Response` など後から安定した builtin がエラーになる。

実行している Node.js を `devEngines.runtime` に書く。app では `engines` を使わない。

```json
{
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": "24.20.0"
    }
  }
}
```

@see <https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-unsupported-features/node-builtins.md>

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
