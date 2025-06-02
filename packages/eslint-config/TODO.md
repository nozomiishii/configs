# TODO

- react-compiler
- jsdoc
- packageJson
- tslint.configからdefineConfigに移行
- cliで簡単にインストールできるようにする
- config-inspectorをgithub pagesに載せる
- ちゃんと全てのルールが適応されているかテストする
- 依存先で`eslint --inspect-config --config eslint.config.ts`みたいに実行してもうまくいかない問題の対応(できるようになったらREADMEも更新する)

```bash
ℹ Reading ESLint config from /Users/nozomiishii/Code/nozomiishii/dev/apps/home/eslint.config.ts
Failed to load `eslint.config.js`.
Note that `@eslint/config-inspector` only works with the flat config format:
https://eslint.org/docs/latest/use/configure/configuration-files-new
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /Users/nozomiishii/Code/nozomiishii/configs/packages/eslint-config/eslint.config.ts
```
