// 利用側プロジェクトの eslint.config.ts に書き出されるテンプレート。
// tsdown により dist/starter.js にビルドされ、init.ts からは re-export として読み込まれる。
export default `export { default } from "@nozomiishii/eslint-config";\n`;
