// このリポジトリは release-please の path-based 振り分けに乗せるため
// scope を意図的に使う運用 (`feat(<package>):` `chore(deps):` 等)。
// shared config の default (scope 禁止) を 0 に落として scope 付きを許可する。
export default {
  extends: ["@nozomiishii/commitlint-config"],
  rules: {
    "scope-empty": [0, "always"],
  },
};
