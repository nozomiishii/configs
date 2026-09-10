# @nozomiishii/configs を subpath exports で配り、利用先の publicHoistPattern を不要にする

計画は [issue](https://github.com/nozomiishii/configs/issues/2846) から移した。実装 PR で育てる。hoist 版の設計は [PR #2841](https://github.com/nozomiishii/configs/pull/2841) にある。

## 目的

利用先が触るものを `@nozomiishii/configs/...` の import / extends と `node_modules/.bin` だけにし、pnpm の hoist 設定を要らなくする。
[メタパッケージ PR](https://github.com/nozomiishii/configs/pull/2841) の対案として、main を base にした別 PR にする。どちらか片方だけをマージできるようにするため。ブランチは #2841 のブランチから切って共通部分を引き継ぐ。

## 決めたこと

- PR の base は main。ブランチは #2841 から切る。子パッケージ 6 つは残す
- meta の `exports` を用途別のサブパスにする。利用先の starter はすべて `@nozomiishii/configs/...` を指す
- bin は meta 自身が wrapper を持つ。hoist に頼らない
- pnpm-workspace.yaml の書き込みと、それに伴う `yaml` / `package-manager-detector` 依存、`agent` オプションを削る

## 変更

### packages/configs の exports

```text
@nozomiishii/configs
├── ./eslint              → eslint.ts        export * from "@nozomiishii/eslint-config" (TS ソースのまま配る。eslint-config と同じ)
├── ./commitlint          → dist/commitlint.js  export { default } from "@nozomiishii/commitlint-config"
├── ./oxfmt               → dist/oxfmt.js       export { default } from "@nozomiishii/oxfmt-config"
├── ./tsconfig/*.json     → tsconfig/*.json     { "extends": "@nozomiishii/tsconfig/tsconfig.<name>.json" } の中継 5 本
├── ./lefthook            → recommended.yaml    子の recommended.yaml の extends パスを meta に置換して build 時に生成
├── ./hooks/*             → hooks/**            build 時に lefthook-config/hooks をコピー
├── ./init                → dist/init/index.js
└── ./package.json
```

- tsconfig の中継は meta の依存として `@nozomiishii/tsconfig` を解決する。TypeScript が symlink 先の実体から解決できることは統合テストで確かめる
- hooks のコピーと `recommended.yaml` の生成は `scripts/build-lefthook.ts` で行い、`build` は `node scripts/build-lefthook.ts && tsdown` と明示する。出力先はパッケージルートにする。lefthook の extends は node の解決を通らず利用先のルートからの相対パスで読むため、`node_modules/@nozomiishii/configs/recommended.yaml` と `node_modules/@nozomiishii/configs/hooks/` が実体として要る。生成物は `.gitignore` に足す。ファイル名は子と同じ `recommended.yaml` にし、starter の置換が `@nozomiishii/lefthook-config` → `@nozomiishii/configs` だけで済むようにする
- `bin`: `commitlint` / `nozo-commitlint` / `postinstall` / `nozo-git-harvest` の wrapper。中身は子の cli を import する 1 行。`nozo-configs-init` は残す

### 子パッケージ

- commitlint-config に `./cli`、lefthook-config に `./cli` の exports を足す。wrapper bin が import するため。postinstall は `.` が cli なので不要
- commitlint-config / eslint-config / lefthook-config / oxfmt-config の init に `specifier?: string` を足す。既定は自パッケージ名。starter 内の自パッケージ名をこの値に置き換え、`@see` の `packages/<子>` も `packages/configs` に置き換えて書く。lefthook は extends が `./node_modules/@nozomiishii/configs/recommended.yaml` になる

### configs の init

- devDependencies の書き換えと子パッケージの直接依存の削除は今のまま
- 子 init を `shouldAddSelfDependency: false` と `specifier` 付きで呼ぶ
- 子パッケージの直接依存を消したとき、monorepo の sub-package に残っている可能性を出力に 1 行添える。meta 経由と直接依存で版が違うと ESLint の plugin が二重登録されるため
- pnpm-workspace.yaml の処理を削る。`agent` オプションも削る
- bin.ts から package-manager-detector を外す

### nozo

- `runInit` から `agent` の受け渡しを外す。`resolvePackageManager` は install のために残す

### README

- packages/configs の README.md と README.ja.md を subpath 前提に書き直す。publicHoistPattern と pnpm 11 以上の記述を消し、利用先の各設定ファイルの書き方と bin 一覧を載せる
- 設計ドキュメント `docs/configs メタパッケージの設計.md` を subpath 版に更新する

## テスト

- `packages/configs/src/init/index.test.ts`: pnpm-workspace.yaml 系を削り、生成された eslint.config.ts / commitlint.config.ts / oxfmt.config.ts / lefthook.yaml が `@nozomiishii/configs/...` を指し、子パッケージ名を含まないことを見る
- `packages/configs/package.test.ts`: dependencies は子 6 つだけ。`exports` に上の 8 種が揃う。hooks のコピーと lefthook-config/hooks が一致する。tsconfig の中継 5 本が `@nozomiishii/tsconfig` の `exports` キーと一致する
- CI の paths-filter に `packages/lefthook-config/hooks/**`、各子の `recommended.yaml` / `starter.*` / `starters/**` を足す
- `packages/configs/src/hoist.integration.test.ts` を `install.integration.test.ts` に改名。`publicHoistPattern` 無しで install し、次を確かめる。この repo 自身は `*eslint*` を hoist しているので、hoist 不要の証明はこの統合テストにだけ置く
  - 一時 consumer は `git init` してから `lefthook dump` を実行する。git repo の外では lefthook が exit 128 になる
  - `.bin` に wrapper 4 本があり、`nozo-commitlint --version` 相当が動く
  - `node -e` で `@nozomiishii/configs/eslint` と `/commitlint` と `/oxfmt` が import できる
  - `tsc --showConfig` が `@nozomiishii/configs/tsconfig/nextjs.json` の extends 連鎖を解決する
  - `lefthook dump` が hooks を解決する
- 子 4 パッケージ: `specifier` で starter の参照先が置き換わるテストを 1 件ずつ
- nozo: `agent` を渡さなくなったことに合わせて既存テストを直す

## 移行

- PR #2841 と同じ。初回 publish の手動作業と required_status_checks は変わらない
- #2841 とこの PR は片方だけをマージする。両方をマージすると hoist 版が一度リリースされる
- 利用先の乗り換え手順は `nozo init` で configs を選ぶだけになり、pnpm の設定は要らない

## 範囲外

- 子パッケージを meta に畳む単一パッケージ化
- tsconfig.json のスキャフォールド

## 比較した案

| 案 | 効果 | コスト |
| --- | --- | --- |
| hooks を build 時にコピー (採用) | 子の hooks が正本のまま | build 手順が 1 つ増える。ドリフトはテストで守る |
| hooks を meta に移し、lefthook-config が meta を参照 | コピー不要 | 依存が逆転し、lefthook-config 単体で使えなくなる |
| starter の置換を meta 側の文字列置換で行う | 子の init に触らない | 子の starter の書き方に meta が依存する |

## 見送った指摘

- なし。敵対的レビューの 10 件はすべて反映した
