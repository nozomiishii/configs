import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import { defineConfig } from "eslint/config";
import { writeFile } from "node:fs/promises";
import * as rules from "../rules";

// rules/index.ts の全 rule を型生成する。
// rule 追加は rules/index.ts に1行足すだけで自動的に網羅される。
const { reactRefresh, ...argless } = rules;

const dts = await flatConfigsToRulesDTS(
  defineConfig([
    ...Object.values(argless).map((rule) => rule()),

    // 引数が必須の rule はここで代表値を渡す。
    // 型生成が見るのは rule 名だけなので、どの target でも結果は変わらない。
    reactRefresh("recommended"),
  ]),
);

await writeFile("eslint-typegen.d.ts", dts);
