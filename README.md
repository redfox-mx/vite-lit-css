# Use Vite styles for your lit components

<p align="center">
  <img width="250" height="200" src="https://raw.githubusercontent.com/redfox-mx/vite-lit-css/main/docs/lit.svg">
  <img width="250" height="200" src="https://raw.githubusercontent.com/redfox-mx/vite-lit-css/main/docs/vite.png">
</p>

Build plugin to import your style files (css, scss, sass, etc..) as lit css tagged-template literals 

__note__: css modules are no supported

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

By default this plugin allow to use files with `.lit.{ext}` (lit.css, lit.scss, etc) pattern, so, every type of style supported by vite could be resolved. For more examples you can see playgrounds.


| option | description | value |
|--|--|--|
|include| Allow to use string or regex to include files to resolve as css tagged templates | `string \| RegExp \| Array<string \| RegExp>` |
|exclude| Allow to use string or regex to exclude files to no resolve as css tagged templates | `string \| RegExp \| Array<string \| RegExp>` |

```ts
// Eg.

import { defineConfig } from 'vite'
import litCss from 'vite-plugin-lit-css'

export default defineConfig({
  plugins: [litCss({
    include: /\.scss/, // includes only scss files as lit styles
    exclude: ['theme.css', 'normalize.css'] // exclude your global styles
  })],
})

/* web-component.ts */

import { LitElement, html } from 'lit';
import { property, customElement } from 'lit/decorators.js'
import styles from './styles.scss';
// or you can use query syntax
import styles from './styles.css?lit';

@customElement('hello-world')
export class LitCSSText extends LitElement {

  public static styles = [styles];

  protected render() {
    return html`<h1>Hello worls</h1>`
  }
}
```