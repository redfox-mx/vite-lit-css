import { customElement } from 'lit/decorators.js'
import { LitCssElement } from './core'
import css from '../styles/fixtures/styles.css'
import scss from '../styles/fixtures/styles.scss'
import sass from '../styles/fixtures/styles.sass'
import { html } from 'lit'

const code = (text: string) => html`<pre><code>${text}</code></pre>`

@customElement('litcss-normal')
export class LitQueryCss extends LitCssElement {
  static styles = [css, scss, sass];

  protected render(): unknown {
    return html`
      <div>
        <p class="css">write this styles with ${code('styles.css')}</p>
        <p class="scss">write this styles with ${code('styles.scss')}</p>
        <p class="sass">write this styles with ${code('styles.sass')}</p>
      </div>
    `
  }

}