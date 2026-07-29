# tanstackStart()

TanStack Start 向け preset で、既存 rule をどう調整したか、なぜそうしたかを残す。

## 組み立て

`node()` からではなく `base()` から組み、Node.js 層 (`eslint-plugin-n`) も含める。SPA mode でも
[server function と server route は使え](https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode)、
shell は SSR ビルドで prerender されて root route の loader がサーバ側で走るため。

`@tanstack/eslint-plugin-router` の `flat/recommended` を有効化する。
`route-param-names` は TanStack Router の import があるファイルだけを見るが、
`create-route-property-order` は callee の名前しか見ないので、別 package の `createRoute` にも当たる。

他プラグインの rule 調整は preset 側に置く。rule module は自分の plugin だけを扱い、
横断的な調整は組み合わせる preset が持つ。上書き対象より後に置く必要があるため preset の末尾にまとまっている。

## 生成物を lint 対象から外す

`routeTree.gen.ts` を ignore する。generator が `vite dev` と `vite build` のたびに書き直すため、
lint で直しても毎回消える。route 2 本のプロジェクトで 28 件落ちていた。

ファイル自身が先頭に `/* eslint-disable */` を持っているが、`base()` の `noInlineConfig: true` が
それを無効化するので効かない。ESLint 自身が「has no effect because you have 'noInlineConfig' setting」と警告する。

`.gitignore` に頼れない。公式の start-basic テンプレートは `routeTree.gen.ts` を gitignore せず repo にコミットしている。

## @typescript-eslint/only-throw-error

`throw redirect()` と `throw notFound()` を許可する。TanStack Router はこの 2 つを throw して制御を移す設計で、
`base()` の `strictTypeChecked` が `only-throw-error` を error にしているため、素直に使うだけで落ちる。

許可する型は
[公式が案内している](https://tanstack.com/router/latest/docs/eslint/eslint-plugin-router)
`@tanstack/router-core` の `Redirect` と `NotFoundError`。

## perfectionist/sort-objects

route 定義のオブジェクトを並べ替えの対象外にする。

route 定義のプロパティ順は型推論に効く。`context` が組み立てた値を `beforeLoad` が受け取り、
それを `loader` が受け取る、という連鎖が順序で決まっている。`create-route-property-order` はその順を守らせる rule で、
アルファベット順とは両立しない。

```tsx
// TanStack が要求する順
{ context: ..., beforeLoad: ... }
// → perfectionist: Expected "beforeLoad" to come before "context"

// perfectionist が要求する順
{ beforeLoad: ..., context: ... }
// → @tanstack/router: Invalid order of properties for `createFileRoute`
```

どちらの順でも片方が怒り、両方 auto fix 可能なので `--fix` が往復する。型推論に効く側を優先した。

除外は `useConfigurationIf.callingFunctionNamePattern` でオブジェクト単位に絞っている。
route 定義は `src/router.tsx` など routes 配下以外にも書けるため、ファイル単位では切れない。
同じファイル内の通常のオブジェクトは今までどおり並ぶ。

判定に使われるのは callee のソース文字列で、`createFileRoute("/about")` のように引数まで含む。
そのため関数名の直後で切るパターンにしている。alias import (`createFileRoute as route`) は捕まえられない。

## no-restricted-syntax (import.meta.env)

`import.meta.env` の直接参照を禁止し、`env.ts` に集約させる。`n/no-process-env` と同じ運用にするため。
`import.meta.env` 向けの専用 rule が無いので selector で書いている。

例外は `env.ts` と `env.*.ts`。edge ランタイムではサーバー env をリクエストごとに読む必要があり、
`env.server.ts` と `env.client.ts` に分ける構成になるため両方を通す。

クライアント側の env は Vite がビルド時に静的置換するので、`env.ts` の module scope で読んで問題ない。
サーバー側は事情が違う。
[TanStack Start のドキュメント](https://tanstack.com/start/latest/docs/framework/react/guide/environment-variables)
が module scope での `process.env` 読み取りを禁じている。

> On Cloudflare Workers and other edge SSR runtimes, env vars are injected at request time —
> module-level `process.env.X` reads run before the env exists and evaluate to `undefined` even on the server.

そのため `env.ts` は値ではなく関数を export し、呼ばれた時に読む。パースしてもこの問題は解けない。
検証を module scope でやると `undefined` を検証して落ちるだけで、失敗が静かなものから大きなものに変わるだけになる。

## unicorn/filename-case

`src/routes/**` で `-` prefix と末尾 `_` を除外する。

[公式のファイル命名規約](https://github.com/TanStack/router/blob/main/docs/router/routing/file-naming-conventions.md)
で `-` prefix は route tree から除外するファイルとディレクトリ、末尾 `_` は親 route に入れ子にしない記法。
どちらも lint の指示どおり kebab-case に直すとルーティングが変わる。

rule ごと off にせず `ignore` オプションで該当パターンだけ外している。
ただし `ignore` は path segment 単位の判定で、1 つでも一致するとそのファイルの検査ごとスキップされる。
`-components/` の中のファイルは kebab-case を強制されなくなる。

## react-refresh/only-export-components

`src/routes/**` で off。

route ファイルは `export const Route` が構造上必須なので、この rule が要求する
「component だけを export する」状態に到達できない。generator が生成する形もそのまま落ちる。

`configs.vite` への切り替えでも `allowExportNames: ["Route"]` でも解消しない。
前者の `allowConstantExport` は `CallExpression` を対象にせず、後者は報告を抑えるだけで判定の分岐を変えないため。

## 採用しなかったもの

`@tanstack/eslint-plugin-start` は入れていない。peer が `^8.57.0 || ^9.0.0` 止まりで eslint 10 に入らず、
rule 2 つがどちらも RSC の `'use client'` 境界の検査で SPA mode には効かない。
追跡は [#2646](https://github.com/nozomiishii/configs/issues/2646)。

`@tanstack/eslint-plugin-query` も入れていない。react-query を使う構成が決まっていないため、使う時点で追加する。

## 既定値を変えている場合

`routesDirectory` を `src/routes` から、`generatedRouteTree` を `src/routeTree.gen.ts` から変えている場合は、
対応する `files` と `ignores` を consumer 側で足す。
