// CSS modules
type CSSModuleClasses = { readonly [key: string]: string }

declare module '*.module.css' {
  const classes: CSSModuleClasses
  export default classes
}
declare module '*.module.scss' {
  const classes: CSSModuleClasses
  export default classes
}
declare module '*.module.sass' {
  const classes: CSSModuleClasses
  export default classes
}
declare module '*.module.less' {
  const classes: CSSModuleClasses
  export default classes
}
declare module '*.module.styl' {
  const classes: CSSModuleClasses
  export default classes
}
declare module '*.module.stylus' {
  const classes: CSSModuleClasses
  export default classes
}
declare module '*.module.pcss' {
  const classes: CSSModuleClasses
  export default classes
}
declare module '*.module.sss' {
  const classes: CSSModuleClasses
  export default classes
}

// CSS
declare module '*.css' {
  const css: import('lit').CSSResult;
  export default css
}
declare module '*.scss' {
  const css: import('lit').CSSResult;
  export default css
}
declare module '*.sass' {
  const css: import('lit').CSSResult;
  export default css
}
declare module '*.less' {
  const css: import('lit').CSSResult;
  export default css
}
declare module '*.styl' {
  const css: import('lit').CSSResult;
  export default css
}
declare module '*.stylus' {
  const css: import('lit').CSSResult;
  export default css
}
declare module '*.pcss' {
  const css: import('lit').CSSResult;
  export default css
}
declare module '*.sss' {
  const css: import('lit').CSSResult;
  export default css
}
declare module '*?lit' {
  const css: import('lit').CSSResult;
  export default css
}