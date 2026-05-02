// 利用側プロジェクトの eslint.config.ts に書き出される実体ファイル。
// init bin はこのファイルを fs.readFileSync で読み取り、テキストのまま出力する。
//
// このファイル自体が利用側にコピーされる「普通の TypeScript」 として完結している必要が
// あるため、template literal や export wrapper でラップしない。

export { default } from "@nozomiishii/eslint-config";
