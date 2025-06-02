# @nozomiishii/eslint-config

Nozomi's Recommended [eslint](https://eslint.org/) Config.

<!-- Main Image -->
<br>
<div align="center">
  <img src="https://media.giphy.com/media/FHEjBpiqMwSuA/giphy.gif" alt="Coding" width="480" />
</div>
<div align="right">
  <small>via GIPHY</small>
</div>
<br>

## Install

```bash
npx -y @nozomiishii/eslint-config@latest
```

## Manual

```bash
pnpm add -D eslint typescript @nozomiishii/eslint-config && touch eslint.config.ts
```

scriptの設定

```bash
pnpm pkg set scripts.eslint="eslint --max-warnings=0 --cache" \
pnpm pkg set scripts.lint="pnpm eslint" \
pnpm pkg set scripts.lint:fix="pnpm eslint --fix"
```

`package.json`

```json
{
  "scripts": {
    "eslint": "eslint --max-warnings=0 --cache",
    "lint": "pnpm eslint",
    "lint:fix": "pnpm eslint --fix"
  }
}
```

`eslint.config.ts`

```ts
export { default } from '@nozomiishii/eslint-config';
```

## References🙏

- [sxzz/eslint-config](https://github.com/sxzz/eslint-config)
- [azat-io/eslint-config](https://github.com/azat-io/eslint-config)
- [antfu/eslint-config](https://github.com/antfu/eslint-config)
- [kazupon/eslint-config](https://github.com/kazupon/eslint-config)
- [AkaraChen/eslint-config](https://github.com/AkaraChen/eslint-config)
- [eslint-react/examples/next-app](https://github.com/Rel1cx/eslint-react/blob/2.0.0-next/examples/next-app/eslint.config.js)
- [vercel/style-guide](https://github.com/vercel/style-guide)
- [airbnb/javascript](https://github.com/airbnb/javascript)
