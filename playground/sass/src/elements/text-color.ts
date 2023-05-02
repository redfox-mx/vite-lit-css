import { LitElement, html } from 'lit';
import { property, customElement } from 'lit/decorators.js'
import styles from './text-color.lit.scss';

@customElement('lcss-text')
export class LitCSSText extends LitElement {

  public static styles = [styles];

  @property({ reflect: true, type: Boolean })
  public accent = false;

  protected render() {
    return html`<span><slot></slot></span>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lcss-text': LitCSSText;
  }
}