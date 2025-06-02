import typegen from 'eslint-typegen';
import configs from '../eslint.config';

/**
 * import typegen from 'eslint-typegen'
 *
 * export default typegen([
 *   // ...your normal eslint flat config
 * ])
 *
 * 上みたいにしようとすると next build で次のエラーになるので postinstall で生成
 * Type error: This expression is not callable.
 *   Type 'typeof import("/Users/nozomiishii/Code/nozomiishii/dev/apps/home/eslint-typegen")' has no call signatures.
 */
await typegen(configs);
