import { defineConfig } from "eslint/config";
import { node } from "./presets/node";

// eslint-config自体はCLI/libraryなのでnode presetで自分をlintする
export default defineConfig([...node()]);
