import pkg from "../package.json" with { type: "json" };

const scope = pkg.name.split("/", 1)[0];

/**
 * @param name The config name.
 *
 * @returns The scoped config name.
 */
export function name(name: string) {
  return scope ? `${scope}/${name}` : name;
}
