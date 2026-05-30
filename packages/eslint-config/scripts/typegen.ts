import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import { defineConfig } from "eslint/config";
import { writeFile } from "node:fs/promises";
import * as rules from "../rules";

// rules/index.ts の全 rule を型生成する。
// rule 追加は rules/index.ts に1行足すだけで自動的に網羅される。
const dts = await flatConfigsToRulesDTS(defineConfig(Object.values(rules).map((rule) => rule())));

await writeFile("eslint-typegen.d.ts", dts);
