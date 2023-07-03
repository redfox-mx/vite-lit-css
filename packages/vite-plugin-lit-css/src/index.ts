import { PluginOption, ResolvedConfig, createFilter, preprocessCSS } from 'vite'
import { dataToEsm } from '@rollup/pluginutils'
import { sanitize } from './sanitize'
import { init, parse } from 'es-module-lexer'
import MagicString from 'magic-string'

export interface Options {
  include?: string | RegExp | Array<string | RegExp>
  exclude?: string | RegExp | Array<string | RegExp>
}

const CSS_LANGS_RE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/
const cssModuleRE = new RegExp(`\\.module${CSS_LANGS_RE.source}`)

const litCssRE = /\.lit.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)/
const inlineRE = /[?&]inline\b/
const jsRE = /\.[tj]sx?$/
const litQueryRE = /[?&]lit\b/

const isJsLike = (id: string) =>
  jsRE.test(id)

const cssModulesCache = new WeakMap<
  ResolvedConfig,
  Map<string, Record<string, string>>
>()

const cssTransform = (css: string) => {
  return [
    `import { css } from \'lit\';`,
    `export default css\`${sanitize(css)}\``
  ].join('\n')
}

const rewriteImport = (id: string) => {
  const queries = []

  if (!inlineRE.test(id) && !cssModuleRE.test(id)) {
    queries.push('inline')
  }

  if (!litQueryRE.test(id)) {
    queries.push('lit')
  }

  return `${id}${id.includes('?') ? '&' : '?'}${queries.join('&')}`
}

export default function litCss(options: Options = {}): PluginOption {
  const filter = createFilter(options.include ?? litCssRE, options.exclude)
  let moduleCache: Map<string, Record<string, string>>
  let config: ResolvedConfig

  return [
    {
      name: 'lit-css',
      buildStart() {
        // Ensure a new cache for every build (i.e. rebuilding in watch mode)
        moduleCache = new Map<string, Record<string, string>>()
        cssModulesCache.set(config, moduleCache)
      },
      async configResolved(_config) {
        config = _config
        const cssPostPlugin = config.plugins.find(plugin => plugin.name === 'vite:css-post')
        if (!cssPostPlugin) return

        // hijack the vite vite:css-post plugin
        const cssPostTransformFn = cssPostPlugin.transform as any

        cssPostPlugin.transform = async function (code, id, options) {
          // check for lit query request
          if (!litQueryRE.test(id)) return cssPostTransformFn.call(this, code, id, options)

          const modules = cssModulesCache.get(config)!.get(id)
          const modulesCode =
            modules && dataToEsm(modules, { namedExports: true, preferConst: true })

          let modulesCss: string = ''
          if (modulesCode) {
            modulesCss = modulesCode.replace(/export default .*/s, '')
          }

          if (config.command === 'serve') {
            return [cssTransform(code), modulesCss].join('\n')
          }

          // keep track of build time vite:css-post optimizations
          const result = await cssPostTransformFn.call(this, code, rewriteImport(id), options)
          let css: string = typeof result === 'string' ? result : result.code

          // remove `export default ` from css inline code 
          css = css.slice(16, -1)
          return [cssTransform(css), modulesCss].join('\n')
        }
      },
    },
    {
      name: 'lit-css:pre',
      transform: {
        order: 'pre',
        async handler(code, id) {
          if (filter(id) && cssModuleRE.test(id)) {
            const {
              modules,
            } = await preprocessCSS(code, id, config)
            if (modules) {
              moduleCache.set(id, modules)
            }

            return null
          }
          if (!isJsLike(id)) return

          await init

          try {
            let [imports] = parse(code)

            const str = new MagicString(code)

            imports.forEach(({ n: specifier, s, e }) => {
              if (
                !specifier ||
                inlineRE.test(specifier) || // keep inline behavior
                !(filter(specifier) || litQueryRE.test(specifier))
              ) return

              str.overwrite(s, e, rewriteImport(specifier))
            })

            return str.toString()
          } catch (e) {
            this.warn({ message: 'Unable to parse file', id })
            return null
          }
        },
      }
    }
  ]
}