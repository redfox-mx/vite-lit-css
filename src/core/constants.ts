export const CSS_LANGS_RE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/
export const cssModuleRE = new RegExp(`\\.module${CSS_LANGS_RE.source}`)

export const inlineRE = /[?&]inline\b/
export const jsRE = /\.[tj]sx?$/
export const litQueryRE = /[?&]lit\b/

export const isJsLike = (id: string) => jsRE.test(id)
export const isInline = (id: string) => inlineRE.test(id)
export const isCssModule = (id: string) => cssModuleRE.test(id)
export const isLitCss = (id: string) => litQueryRE.test(id);