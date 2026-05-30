import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import { writeFile } from "node:fs/promises";
import { nextjs } from "..";

// 型は全rule網羅のためnextjs(フル)から生成する
const dts = await flatConfigsToRulesDTS(nextjs());

await writeFile("eslint-typegen.d.ts", dts);
