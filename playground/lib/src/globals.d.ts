/// <reference path="vite/types/importMeta.d.ts" />

declare module '*.css' {
  export const styles: import('lit').CSSResult
  export default styles;
}