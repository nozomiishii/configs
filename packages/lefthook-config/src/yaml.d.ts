/**
 * Treats every `*.yaml` import as the file's full UTF-8 contents.
 *
 * tsdown's `loader: { ".yaml": "text" }` inlines the YAML file as a
 * string at build time; this declaration tells TypeScript to expose
 * that string via the default export. The internal binding name is
 * an implementation detail — consumers see only the default export.
 */
declare module "*.yaml" {
  const yaml: string;
  export default yaml;
}
