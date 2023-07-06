import {
  CSSResultGroup,
  CSSResultOrNative,
  LitElement,
} from 'lit'
import coreCss from '../styles/core.css'

export class LitCssElement extends LitElement {

  protected static finalizeStyles(styles?: CSSResultGroup): CSSResultOrNative[] {
    const elementStyles = super.finalizeStyles(styles)
    return [coreCss, ...elementStyles]
  }
}