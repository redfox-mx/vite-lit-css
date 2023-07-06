import { customElement } from 'lit/decorators.js'
import { LitCssElement } from './core'
import css, { module } from '../styles/fixtures/styles.module.css'
import { html } from 'lit'

const code = (text: string) => html`<pre><code>${text}</code></pre>`

@customElement('litcss-module')
export class LitQueryCss extends LitCssElement {
  static styles = [css];

  protected render(): unknown {
    return html`
      <div>
        <p class="${module}">write this styles with ${code('styles.module.css')}</p>
      </div>
    `
  }

}