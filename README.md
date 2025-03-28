# Use Vite styles for your lit components

<p align="center">
  <img height="200" src="https://raw.githubusercontent.com/redfox-mx/vite-lit-css/main/docs/lit.svg">
</p>

> Plugin to get all the power of Vite styles with lit tagged-template ⚡. 

This plugin aims to get work with css lang stylesheet and lit template literals as simply as any other library or front-end framework.

## Installation

```bash
$ npm install -D vite-plugin-lit-css

# yarn
$ npm install -D vite-plugin-lit-css

# pnpm
$ pnpm add -D vite-plugin-lit-css
```

## Usage

Add `vite-plugin-lit-css` to your Vite config.

```ts
import { defineConfig } from 'vite'
import litCss from 'vite-plugin-lit-css'

export default defineConfig({
  plugins: [litCss({
    // your global and rel="stylesheet" styles must be excluded
    exclude: './src/index.css'
  })],
})
```

Then, import your stylesheets as any other javascript module in your code.

```ts
import { LitElement } from 'lit'
import styles from './styles.css'

export class Element extends LitElement {
  static styles = [styles, queryStyles]

}
```

### Typescript

You can use types definitions inside your vite-env.d.ts. _Remember: order is important!_

```ts
/// <reference types="vite-plugin-lit-css/client" />
/// <reference types="vite/client" />
```


## Options

This plugin will transform all your css like styles by default into constructible library-specific css styles, but you can take control of this transformation with the include and exclude options.

```ts
import { defineConfig } from 'vite'
import litCss from 'vite-plugin-lit-css'

export default defineConfig({
  plugins: [litCss({
    include: /\.scss/, // transform only scss files as lit styles
    exclude: [/global.css/, './src/index.css'] // exclude your global styles
  })],
})

// index.ts

import './styles.global.css' // this file will skipped from this plugin
```

> Your index.html will be transformed. You __must__ include your theme or global css files inside exclude option!!.


## Caveats

- Currently, HMR is not supported, and every change made inside your lit imported styles will trigger a full page reload.

- For vite v4 use vite-plugin-lit-css 1.x
