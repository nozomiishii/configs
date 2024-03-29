# tsconfig

- 自作よりも[tsconfig/bases](https://github.com/tsconfig/bases)のレポジトリを参考にするのがいい

## 設定解説

```jsonc
// https://www.typescriptlang.org/tsconfig
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "@nozomiishii/tsconfig",

  "compilerOptions": {
    // nodeバージョンとサポートターゲット対応例 https://github.com/microsoft/TypeScript/wiki/Node-Target-Mapping
    "target": "es5",

    "lib": ["dom", "dom.iterable", "esnext"],

    // import文をどうコンパイルするか ⚠️ なやみ
    "module": "commonjs",

    // Import 対象のソースコード・型定義ファイルをどのように検索するか
    "moduleResolution": "node",

    //　CommonJSで定義されてるモジュールを変換してESModuleでも利用できるようにするか
    "esModuleInterop": true,

    // JSONファイルの型抽出、生成するか
    "resolveJsonModule": true,

    // すべてのファイルがimportやexportで関連付けられてるか
    "isolatedModules": true,

    // tsxファイルの変換方法
    "jsx": "preserve",

    // tsconfig.tsbuildinfoを生成して差分コンパイルにより時間短縮するか
    "incremental": true,

    // ファイルパスの大文字小文字を区別するか
    "forceConsistentCasingInFileNames": true,

    // ライブラリの型の不一致を無視するか https://gist.github.com/azu/56a0411d69e2fc333d545bfe57933d07#skiplibcheck
    "skipLibCheck": false,

    // Strict mode
    "strict": true,
  },
}
```
