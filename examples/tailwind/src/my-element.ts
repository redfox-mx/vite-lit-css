import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { TailwindElement } from './core/tailwind'
import styles from './my-element.css'
import litLogo from './assets/lit.svg'
import viteLogo from '/vite.svg'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends TailwindElement {
  /**
   * Copy for the read the docs hint.
   */
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more'

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

  render() {
    return html`
      <div>
        <a 
          href="https://vitejs.dev" 
          target="_blank"
          class="font-medium text-[#646cff] hover:text-[#535bf2]"
          >
          <img 
            src=${viteLogo}
            alt="Vite logo"
            class="logo h-24 p-6" 
            />
        </a>
        <a 
          href="https://lit.dev"
          target="_blank"
          class="font-medium text-[#646cff] hover:text-[#535bf2]"
          >
          <img
            src=${litLogo}
            alt="Lit logo"
            class="logo lit"
            />
        </a>
      </div>
      <slot></slot>
      <div class="card p-[2em]">
        <button 
          @click=${this._onClick} 
          part="button"
          class="
            rounded-lg border-[1px] border-solid border-transparent hover:border-[#646cff]
            py-[0.6em] px-[1.2em] text-[1em] 
            font-medium cursor-pointer
            bg-[#1a1a1a]"
        >
          count is ${this.count}
        </button>
      </div>
      <p class="read-the-docs">${this.docsHint}</p>
    `
  }

  private _onClick() {
    this.count++
  }

  static styles = [styles]

}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
