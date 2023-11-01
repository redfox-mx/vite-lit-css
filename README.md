<p align="center">
  <img height="200" src="https://raw.githubusercontent.com/redfox-mx/vite-lit-css/main/docs/lit.svg">
</p>

# Use Vite styles for your lit components

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
  plugins: [litCss()],
})
```

Then, import your stylesheets as any other javascript module[^1] in your code.

```ts
import { LitElement } from 'lit'
import styles from './styles.css'
// or you can use query syntaxis
import queryStyles from './styles.scss?lit'

export class Element extends LitElement {
  static styles = [styles, queryStyles]

}
```

> __note__: Please do not try to mix both import styles (query and non-query) since this probably duplicates your css (transformed) code.

### Typescript

You can use types definitions inside your vite-env.d.ts. _Remember: order is important!_

```ts
/// <reference types="vite-plugin-lit-css/client" />
/// <reference types="vite/client" />
```

### css modules

This plugin allows working with css modules (experimental), so you can import as the following example.

```css
/* styles.module.css */
.title {
  font-size: 2rem;
}

.error {
  color: red;
}
```

And in your javascript/typescript file.

```ts
import { LitElement, html } from 'lit'
import styles, { title, error } from './styles.module.css'

export class Element extends LitElement {
  static styles = [styles]
  
  render() {
    return html`
      <h1 class="${ title }">This is a error title</h1>
      <p class="${ error }">And a error text</p>
    `
  }
}
```

Optionally, you can enable auto-generated typescript file definition (experimental) for your css modules to get a more comfortable DX experience.

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import litCss from 'vite-plugin-lit-css'

export default defineConfig({
  plugins: [litCss({ dts: true })],
})
```

## Options

This plugin will transform all your css like styles by default into constructible library-specific css styles, but you can take control of this transformation with the include and exclude options.

```ts
import { defineConfig } from 'vite'
import litCss from 'vite-plugin-lit-css'

export default defineConfig({
  plugins: [litCss({
    include: /\.scss/, // transform only scss files as lit styles
    exclude: [/global.css/] // exclude your global styles
  })],
})

// index.ts

import './styles.global.css' // this file will skiped from this plugin
```

> Your index.html __never__ be transformed. You can put your theme or global css variables/styles inside it.


## Caveats

- Currently, HMR is not supported, and every change made inside your lit imported styles will trigger a full page reload.

[^1]: `vite-plugin-lit-css` patch your imports to prevent `vite:css-post` from emitting incorrect css assets and `vite:import-analysis` from getting warnings.
