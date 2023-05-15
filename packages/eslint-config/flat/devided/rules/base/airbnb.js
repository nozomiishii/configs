// FIXME: pluginsのflat-config未対応、対応後@ts-checkを有効にする
import { defineFlatConfig } from 'eslint-define-config';
import { rules as baseBestPracticesRules } from 'eslint-config-airbnb-base/rules/best-practices';
import { rules as baseErrorsRules } from 'eslint-config-airbnb-base/rules/errors';
import { rules as baseES6Rules } from 'eslint-config-airbnb-base/rules/es6';
import { rules as baseImportsRules } from 'eslint-config-airbnb-base/rules/imports';
import { rules as baseStyleRules } from 'eslint-config-airbnb-base/rules/style';
import { rules as baseVariablesRules } from 'eslint-config-airbnb-base/rules/variables';

export default defineFlatConfig([
  {
    rules: {
      ...baseBestPracticesRules,
      ...baseErrorsRules,
      ...baseES6Rules,
      ...baseImportsRules,
      ...baseStyleRules,
      ...baseVariablesRules,
    },
  },
]);
