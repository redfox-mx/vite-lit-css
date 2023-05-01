/// <reference path="vite/types/importMeta.d.ts" />

declare module '*.css' {
  const css: import('lit').CSSResult
  export default css;
}