// @ts-check
import { defineFlatConfig } from 'eslint-define-config';
import prettier from './rules/prettier';
import testTools from './rules/test-tools';
import tailwindcss from './rules/tailwindcss';
import next from './rules/next';
import react from './rules/react';
import typescript from './rules/typescript';
import base from './rules/base';

export default defineFlatConfig([
  ...base,
  ...typescript,
  ...react,
  ...next,
  ...tailwindcss,
  ...testTools,
  ...prettier,
]);
