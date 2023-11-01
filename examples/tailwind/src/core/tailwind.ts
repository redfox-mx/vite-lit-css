import { LitElement, CSSResultGroup, CSSResultOrNative } from 'lit'
import tailwind from './tailwind.css'

export class TailwindElement extends LitElement {
  protected static finalizeStyles(styles?: CSSResultGroup | undefined): CSSResultOrNative[] {
    const elementStyles = super.finalizeStyles(styles)

    return [...elementStyles, tailwind]
  }
}