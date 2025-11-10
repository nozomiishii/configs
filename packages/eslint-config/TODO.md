# TODO

- tslint.configからdefineConfigに移行
  - <https://github.com/typescript-eslint/typescript-eslint/pull/11475>
- 全てのrulesにfiles指定書く
- jsdoc
- packageJson
- eslint.style [https://eslint.style/]
  - @eslint/jsで非推奨になってしまったルールの削除
- cliで簡単にインストールできるようにする
- config-inspectorをgithub pagesに載せる
- ちゃんと全てのルールが適応されているかテストする
- 依存先で`eslint --inspect-config --config eslint.config.ts`みたいに実行してもうまくいかない問題の対応(できるようになったらREADMEも更新する)
- マルチスレッド対応
  - <https://eslint.org/blog/2025/08/multithread-linting>

```bash
ℹ Reading ESLint config from /Users/nozomiishii/Code/nozomiishii/dev/apps/home/eslint.config.ts
Failed to load `eslint.config.js`.
Note that `@eslint/config-inspector` only works with the flat config format:
https://eslint.org/docs/latest/use/configure/configuration-files-new
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /Users/nozomiishii/Code/nozomiishii/configs/packages/eslint-config/eslint.config.ts
```
