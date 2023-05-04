# Use Vite styles for every lit component

This plugins allow to use styles (sass, scss, css, less, stylus) for create tagged css tempplates with vite.

## Usage

Install

```bash
$ npm install -D vite-plugin-lit-css

# yarn
$ npm install -D vite-plugin-lit-css

# pnpm
$ pnpm add -D vite-plugin-lit-css
```

Now, add `litCss` plugin in your `vite.config`

```ts
import { defineConfig } from 'vite'
import litCss from 'vite-plugin-lit-css'

export default defineConfig({
  plugins: [litCss()],
})
```

### Options

By default this plugin allow to use files with `.lit.{ext}` pattern, so, every type of style supported by vite could be resolved. For more examples you can see playglounds.


| option | description | value |
|--|--|--|
|include| Allow to use string or regex to include files to resolve as css tagged templates | `string \| RegExp \| Array<string \| RegExp>` |
|exclude| Allow to use string or regex to exclude files to no resolve as css tagged templates | `string \| RegExp \| Array<string \| RegExp>` |