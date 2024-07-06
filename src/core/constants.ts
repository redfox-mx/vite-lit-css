export const CSS_LANGS_RE =
  /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/;
export const cssModuleRE = new RegExp(`\\.module${CSS_LANGS_RE.source}`)
export const directRequestRE = /[?&]direct\b/

export const inlineRE = /[?&]inline\b/

export const isInline = (id: string) => inlineRE.test(id)
export const isCssModule = (id: string) => cssModuleRE.test(id)
export const isDirectCSSRequest = (request: string): boolean =>
  CSS_LANGS_RE.test(request) && directRequestRE.test(request)