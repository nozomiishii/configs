# @nozomiishii/prettier-config

[English](./README.md) | 日本語

共通の [Prettier](https://prettier.io) 設定。

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/3o6Zt9ADoZ9grTGu1a/giphy.gif" alt="Coding" width="480" />
</div>
<div align="right">
  <p style="font-size: 0.75em; color: #656D76;">via South Park on GIPHY</p>
</div>
<br>

## インストール

[`nozo`](../nozo) CLI を使う:

```bash
pnpx nozo init
```

これで `@nozomiishii/prettier-config` / `prettier` が pin で `devDependencies` に追加され、`"type": "module"` が設定され、`format` / `format:fix` / `prettier` の scripts が追加され、shared config を re-export する `prettier.config.ts` が生成される。
`**/routeTree.gen.ts` は `.prettierignore` に追記される。

## 同梱プラグイン

- [prettier-plugin-packagejson](https://www.npmjs.com/package/prettier-plugin-packagejson)

## ポリシー

### ファイル除外

[shareable config](https://prettier.io/docs/sharing-configurations/) は通常の
Prettier設定だけを提供する仕組みであり、ファイルのignore状態は設定できない。
[Prettier公式のignore手順](https://prettier.io/docs/ignore/)に従い、initはconsumer
rootの`.prettierignore`へ`**/routeTree.gen.ts`を追記する。既存の内容は保持する。
[TanStack Routerも生成されたroute treeをformatterから除外するよう案内している](https://tanstack.com/router/latest/docs/framework/react/installation/with-router-cli#ignoring-the-generated-route-tree-file)。
これによりCLIとeditorの両方が生成されたroute treeを対象外として扱い、
`prettier --file-info src/routeTree.gen.ts`は`ignored: true`を返す。

既存projectでは`pnpx nozo init`を再実行するか、`.prettierignore`へ
`**/routeTree.gen.ts`を手動で追加する。`--ignore-path`を指定している場合、
[既定のignore file探索を置き換える](https://prettier.io/docs/cli#--ignore-path)ため、
指定を外すか`.gitignore`と`.prettierignore`の両方を渡す。

`pnpm-lock.yaml` / `submodules/**` / `next-env.d.ts` / `*.md` / `*.mdx` /
`**/.claude/settings.json`はshared configの`overrides`で`requirePragma: true`を
指定し、pragmaが無い限りformatしない。未移行projectを保護するため、
`**/routeTree.gen.ts`にも同じoverrideを互換用として残す。

`**/.claude/settings.json` は `parser: jsonc` も要る。Claude Code が多行配列で
書き戻すうえ、`json` parser は `requirePragma` を無視するため (`jsonc` は尊重する)。

Prettier 3.6 で追加された `checkIgnorePragma`
(`@noformat` / `@noprettier`) は採用しない。opt-out の入り口を増やす
必要がないため。

### experimental option は採用しない

Prettier の `experimental*` 系オプション
(`experimentalOperatorPosition` / `experimentalTernaries` など) は今回
も今後も採用しない。formatter は出力が揃ってさえいれば挙動の細部は
どうでもよく、stable 化されて default になるのを待つだけで十分。
experimental の挙動変化を追いかける価値はない。

### oxfmt への移行方針

将来的に [oxfmt](https://oxc.rs/) (OXC プロジェクトの Prettier 互換
formatter) に移行する意図はある。トリガーは **oxlint が ESLint の
ルールを完全に飲み込んだとき**。それまでは Prettier を使い続ける。

oxfmt は Prettier の config をそのまま受け取れる設計のため、本
パッケージの設定は移行時にほぼそのまま流用できる見込み。逆に、
oxfmt 互換ではない Prettier plugin を増やすほど将来の移行コストが
上がるため、必須でない plugin は追加しない方針。
