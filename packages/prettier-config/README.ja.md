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

## 同梱プラグイン

- [prettier-plugin-packagejson](https://www.npmjs.com/package/prettier-plugin-packagejson)

## ポリシー

### ファイル除外: `.prettierignore` ではなく `requirePragma` を使う

format 対象外にしたいファイル (`pnpm-lock.yaml` / `submodules/**` /
`next-env.d.ts` / `*.md` / `*.mdx` / `**/.claude/settings.json`) は、この
パッケージの `overrides` で `requirePragma: true` を指定して除外している。
`.prettierignore` ファイルは作らない。

`**/.claude/settings.json` は `parser: jsonc` も要る。Claude Code が多行配列で
書き戻すうえ、`json` parser は `requirePragma` を無視するため (`jsonc` は尊重する)。

`.prettierignore` を導入すると `.gitignore` と二重管理になり、片方だけ
更新する事故を起こしやすい。Prettier 3.x は `.gitignore` を自動で尊重
するため、ほとんどの ignore は `.gitignore` だけで足りる。

同じ理由から、Prettier 3.6 で追加された `checkIgnorePragma`
(`@noformat` / `@noprettier`) は採用しない。opt-out の入り口を増やす
だけで、`.prettierignore` 問題そのものは解決しないため。

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
