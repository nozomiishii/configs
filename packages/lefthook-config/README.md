# @nozomiishii/lefthook-config

Nozomi's Recommended [lefthook](https://github.com/evilmartians/lefthook) config.

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/US7vLRTU5sAPcQcEHx/giphy.gif" alt="Coding" width="480" />
</div>
<br>

## Gist

```sh
npx -y @nozomiishii/lefthook-config@latest
```

## Manual

### Use as Dependency

```sh
pnpm add -D lefthook @nozomiishii/lefthook-config
```

lefthook.yaml

```yaml
extends:
  - ./node_modules/@nozomiishii/lefthook-config/index.yaml
```

```sh
npx lefthook install
```

<!-- renovate対応しなきゃいけないのと、extendsのpathが変わるのでindex-remote.yaml的なの作らなきゃかな-->
<!-- ### Use as remote config

lefthook.yaml or lefthook-local.yaml

```yaml
remote:
  git_url: https://github.com/nozomiishii/configs
  config: packages/lefthook-config/index.yaml
```

```sh
npx lefthook install
```

[See more details](https://github.com/evilmartians/lefthook/blob/master/docs/configuration.md) -->
