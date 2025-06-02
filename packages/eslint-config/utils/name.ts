import pkg from '../package.json';

const scope = pkg.name.split('/')[0];

/**
 * @param name The config name.
 *
 * @returns The scoped config name.
 */
export function name(name: string) {
  return scope ? `${scope}/${name}` : name;
}
