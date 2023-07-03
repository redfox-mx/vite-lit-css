import { LitElement, html } from 'lit';
import { property, customElement } from 'lit/decorators.js'
import styles from './text-color.css';
import mod, { red } from './test.module.css';


@customElement('lcss-text')
export class LitCSSText extends LitElement {

  public static styles = [styles, mod];

  @property({ reflect: true, type: Boolean })
  public accent = false;

  protected render() {
    return html`<span class="${red}"><slot></slot></span>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lcss-text': LitCSSText;
  }
}