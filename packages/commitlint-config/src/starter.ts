// 利用側プロジェクトの commitlint.config.ts に書き出されるテンプレート。
// tsdown により dist/starter.js にビルドされ、init.ts からは re-export として読み込まれる。
export default `import config from "@nozomiishii/commitlint-config";

export default config;
`;
