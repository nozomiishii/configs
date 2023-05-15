// FIXME: rulesのflat-config未対応、対応後@ts-checkを有効にする
import { defineFlatConfig } from 'eslint-define-config';
import airbnbTypescript from 'eslint-config-airbnb-typescript/lib/shared';

export default defineFlatConfig([
  {
    rules: {
      ...airbnbTypescript.rules,
      // シャドウイングの許容
      '@typescript-eslint/no-shadow': 'off',
    },
  },
]);
