# @nozomiishii/configs メタパッケージを追加し、nozo init の既定にする

計画は [issue](https://github.com/nozomiishii/configs/issues/2840) から移した。実装 PR で育てる。

## 目的

利用先が devDependencies 1 行でおすすめ一式を導入できるようにする。
既存の個別パッケージは残し、メタパッケージはそれらに依存するだけにする。

## 決めたこと

- 含める: commitlint-config / eslint-config / lefthook-config / oxfmt-config / postinstall / tsconfig
- 含めない: prettier-config / cspell-config / markdownlint-cli2-config。おすすめ一式ではない
- pnpm 利用先には [publicHoistPattern](https://pnpm.io/settings/node-modules#publichoistpattern) に `@nozomiishii/*` が要る。推移依存の bin link と、lefthook-config の `recommended.yaml` が `node_modules/@nozomiishii/lefthook-config/hooks/...` を直接指すため。nozo init が pnpm-workspace.yaml に書き込む
- nozo init の既定を configs 一式にし、個別選択も残す
- release PR をマージする前に、`@nozomiishii/configs` を npm へ手動で 1 度 publish し、trusted publisher を登録する

## 確かめたこと

- publicHoistPattern で hoist した推移依存の bin が `node_modules/.bin` に link されることは公式に書かれていない。`file:` 依存の最小構成で実測して確認した
- pnpm-workspace.yaml のキーは camelCase だけが有効。kebab-case は無視されることを実測した
- 新パッケージの初回 npm publish は OIDC では通らない。oxfmt-config を足したときの release がこれで止まり、手動 publish 後に再実行した

## 変更

### packages/configs を新設する

npm 名は `@nozomiishii/configs`。

- `dependencies`: 含める 6 パッケージを `workspace:*` で。pnpm-workspace.yaml の編集用に `yaml` も入れる。コメント保持のため Document API を使う
- `peerDependencies`: `eslint` / `typescript` / `oxfmt` / `lefthook`。子パッケージの peer と同じ exact 値
- `exports`: `./package.json` と `./init`。`.` は無し
- `bin`: `nozo-configs-init`
- `files`: `bin` / `dist` / `README.md`
- scripts / devEngines / tsdown.config.ts / tsconfig.json / eslint.config.ts は lefthook-config をひな型にする

`src/init/index.ts` の InitOptions は `cwd` に加えて `agent`、eslint init に渡す `monorepo` と `preset` を取る。処理は次の順。

- 利用先 package.json の devDependencies に `@nozomiishii/configs` を書く。子 6 パッケージのキーが残っていれば削除し、削除した名前をログに出す。peer は書かず、子 init に任せる
- 子パッケージの init を `shouldAddSelfDependency: false` で順に呼ぶ。commitlint → eslint → lefthook → oxfmt → postinstall。設定ファイル生成と scripts / peer の書き込みは子に任せる。tsconfig には init が無いので何もせず、README で `extends` を案内する
- `agent` が pnpm のとき、`publicHoistPattern` に `@nozomiishii/*` を追加する。対象ファイルは cwd から上に向かって最初に見つかる pnpm-workspace.yaml。無ければ cwd に作る。既にあれば重複追加しない。コメントと他のキーは保持する

### 子パッケージ 5 つの init に `shouldAddSelfDependency?: boolean` を足す

commitlint-config / eslint-config / lefthook-config / oxfmt-config / postinstall。既定は true。
false のとき `[selfPkg.name]: selfPkg.version` の書き込みだけを飛ばす。peer と scripts と設定ファイルは従来どおり。

### nozo init

```text
nozo init
├── configs (既定)
│   ├── eslint の preset と monorepo を聞く
│   └── @nozomiishii/configs/init を agent 付きで 1 回呼ぶ
└── individual
    └── 今の multiselect。tools には configs を足さない
```

prompt と実行を分け、実行部を `runInit({ mode, cwd, agent, eslint })` として export する。テストはこの関数に対して書く。
nozo の dependencies に `@nozomiishii/configs: workspace:*` を足す。

### repo の配線

- `.github/.release-please-config.json`: `packages/configs` を packages と linked-versions の components に追加。component は `@nozomiishii/configs`
- `.github/.release-please-manifest.json`: `"packages/configs": "2.6.0"`。package.json の version も同じ値
- `.github/workflows/configs.yaml`: oxfmt-config.yaml をひな型にする。paths-filter には `packages/configs/**` に加えて `packages/*/package.json` を入れ、Renovate が子の peer だけ更新した PR でもドリフト検知テストが走るようにする。test job に `pnpm test` と `pnpm test:integration` の 2 step を置く。required の job name は `Configs / required`
- README.md / README.ja.md の Packages 表、packages/nozo/README(.ja).md の Sibling packages 表に行を足す
- packages/configs/README.md と README.ja.md: 含まれるもの、Install は `nozo init` と手動の 2 通り、`tsconfig` の `extends` 例、prettier / cspell / markdownlint は個別導入と明記、pnpm 11 以上

## テスト

- `packages/configs/src/init/index.test.ts`
  - devDependencies に `@nozomiishii/configs` と 4 peer が入り、子パッケージ名は入らない
  - 既存の `@nozomiishii/eslint-config` などの直接依存が devDependencies から消える
  - 子 init が生成するファイルと scripts が揃う
  - pnpm: pnpm-workspace.yaml が無ければ作る / 既存のキーとコメントを保持して追記する / 既に `@nozomiishii/*` があれば重複しない / 上位ディレクトリにあればそちらに追記する
  - npm / bun: pnpm-workspace.yaml を作らない
- `packages/configs/package.test.ts`: ドリフト防止
  - `dependencies` のキー集合が決めた 6 つ + yaml と一致する
  - `peerDependencies` が子パッケージの peerDependencies の和集合と値まで一致する
- `packages/configs/src/hoist.integration.test.ts`: bin link の実測を守る
  - `pnpm pack` でメタと子を tarball にし、一時 dir に `publicHoistPattern` を置いて `pnpm install --ignore-scripts` する。`--offline` は store の状態に依存して flaky になるので使わない
  - `node_modules/.bin/nozo-commitlint` / `postinstall` / `nozo-git-harvest` と `node_modules/@nozomiishii/lefthook-config/hooks` が存在すること
  - ネットワークが要るので `pnpm test` から除外し、`pnpm test:integration` として CI の test job で回す
- 子パッケージ 5 つ: `shouldAddSelfDependency: false` で自パッケージ名が書かれないテストを 1 件ずつ足す
- nozo: `runInit({ mode: "configs" })` が `@nozomiishii/configs/init` を agent 付きで 1 回呼び、individual のときは呼ばないこと

## 移行

- 既存利用先への影響なし。子パッケージの init は既定値で従来どおり
- 利用先を configs に乗り換えるときは `nozo init` で configs を選ぶ。手動手順も README に書く
- 初回 publish はユーザー作業。release PR をマージする前に `packages/configs` で `pnpm publish --no-git-checks` を実行し、npm のパッケージ設定で trusted publisher を登録する
- infra 側の required_status_checks に `Configs / required` を足すのは、workflow が main に入った後にする。先に足すと既存 PR が Expected で止まる

## 範囲外

- tsconfig.json のスキャフォールド
- 子パッケージの deprecate や統合

## 比較した案

| 案 | 効果 | コスト |
| --- | --- | --- |
| メタパッケージ (採用) | 導入 1 行、既存パッケージ無変更、後戻り可 | 利用先に publicHoistPattern が要る |
| 単一パッケージへ統合 | hoist 不要、CI / release も 1 本 | 9 パッケージの deprecate と利用先の import 書き換え |
| configs 側で bin / hooks を再エクスポート | hoist 不要 | 子に bin を足すたびに configs も直す二重管理 |
| build 時に子の bin / hooks からシムを自動生成 | hoist 不要、二重管理も無い | lefthook の extends パスが子の recommended.yaml 内で固定されているのでシムでは解決しない。利用先の lefthook.yaml も別 starter が要る |

## 見送ったレビュー指摘

- `.npmrc` の `public-hoist-pattern` との衝突: pnpm 11 以降は `.npmrc` から auth と registry 以外の設定を読まないため対象外
- pnpm-workspace.yaml の kebab-case キーへの追記: 有効でないキーに追記しても意味が無いので、camelCase キーに書く
