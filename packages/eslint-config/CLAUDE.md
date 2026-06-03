# CLAUDE.md

## rule の説明コメント

- 各 rule には概要を掴める短い 1 文だけ書く。
- 詳細は公式ドキュメントへの `@see` リンクに委ねる。

## rule の severity 方針

- Auto Fix できる rule は `warn`、Auto Fix できない rule は `error` を基本にする。

## vitest ルールの方針

- `rules/vitest.ts` は今 `configs.all`。実体験ベースで不要ルールを off にし、いずれ `recommended` へ切替予定。判定の追跡は [#2358](https://github.com/nozomiishii/configs/issues/2358)。
