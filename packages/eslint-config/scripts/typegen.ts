import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import { writeFile } from "node:fs/promises";
import configs from "../eslint.config";

const dts = await flatConfigsToRulesDTS(configs);

await writeFile("eslint-typegen.d.ts", dts);
