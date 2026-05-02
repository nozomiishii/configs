// 利用側プロジェクトの commitlint.config.ts に書き出される実体ファイル。
// init bin はこのファイルを fs.readFileSync で読み取り、テキストのまま出力する。
//
// このファイル自体が利用側にコピーされる「普通の TypeScript」 として完結している必要が
// あるため、template literal や export wrapper でラップしない。
//
// commitlint cli は config を `extends` フィールドで階層 merge する設計のため、
// shared config を直接 default export するのではなく、`extends` 経由で参照する形を
// 採る。`import config from "..."; export default config;` のような re-export では
// commitlint 側の rule / plugins merge が期待どおりに効かないことがある。

export default { extends: ["@nozomiishii/commitlint-config"] };
