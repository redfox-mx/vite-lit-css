import { Plugin, createFilter, ResolvedConfig, preprocessCSS } from 'vite'
import { init, parse } from 'es-module-lexer'
import { isCssModule, isInline, isJsLike, isLitCss } from './core/constants'
import { css, cssModules } from './core/transform'
import { Engines, Engine, engines } from './core/engines'
import MagicString from 'magic-string'
import { createDts, writeDts } from './core/dts'

export interface Options {
  include?: string | RegExp | Array<string | RegExp>
  exclude?: string | RegExp | Array<string | RegExp>
  engine?: Engines | Engine
  dts?: boolean
}

const litCssRE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)/

const cssModulesCache = new WeakMap<
  ResolvedConfig,
  Map<string, Record<string, string>>
>()

const patchImport = (id: string) => {
  const queries = []
  if (!isInline(id) && !isCssModule(id)) {
    // inline prevent emit css aseet for lit styles
    queries.push('inline')
  }

  if (!isLitCss(id)) {
    // lit queries are handled by our hijack css-post
    queries.push('lit')
  }

  return `${id}${id.includes('?') ? '&' : '?'}${queries.join('&')}`
}

export default function litCss(options: Options = {}): Plugin {
  const filter = createFilter(options.include ?? litCssRE, options.exclude)
  const engine = options.engine
    ? typeof options.engine === 'string'
      ? engines[options.engine] : options.engine
    : engines.lit
  let moduleCache: Map<string, Record<string, string>>
  let config: ResolvedConfig
  return {
    name: 'lit-css',
    enforce: 'pre',
    buildStart() {
      // Ensure a new cache for every build (i.e. rebuilding in watch mode)
      moduleCache = new Map<string, Record<string, string>>()
      cssModulesCache.set(config, moduleCache)
    },
    async configResolved(conf) {
      config = conf

      const cssPostPlugin = config.plugins.find(plugin => plugin.name === 'vite:css-post')
      if (!cssPostPlugin) return

      // hijack the vite vite:css-post plugin
      const cssPostTransformFn = cssPostPlugin.transform as any
      cssPostPlugin.transform = async function (code, id, ...args) {
        if (!isLitCss(id)) return cssPostTransformFn.call(this, code, id, ...args)

        const modules = cssModulesCache.get(config)!.get(id)

        if (config.command == 'serve') {
          return [
            css(code, engine),
            cssModules(modules)
          ].join('\n')
        }

        let result = await cssPostTransformFn.call(this, code, patchImport(id), ...args)
        result = typeof result === 'string' ? result : result.code
        result = result.slice(16, -1)

        return [
          css(result, engine),
          cssModules(modules)
        ].join('\n')
      }
    },
    async transform(code, id) {
      // hack to get css module name
      if (filter(id) && isCssModule(id)) {
        // unfortunately this step is necessary to get the CSS modules
        const { modules } = await preprocessCSS(code, id, config)
        if (!modules) return

        moduleCache.set(id, modules)

        if (options.dts === true) {
          const dts = createDts({ modules, ...engine })
          writeDts(id, dts)
        }

        return null
      }

      if (isJsLike(id)) {
        await init

        try {

          let [imports] = parse(code)
          const str = new MagicString(code)

          imports.forEach(({ n: specifier, s: start, e: end }) => {
            if (
              !specifier ||
              isInline(specifier) || // force to keep inline behavior
              !(filter(specifier) || isLitCss(specifier))
            ) return

            str.overwrite(start, end, patchImport(specifier))
          })

          let map = str.generateMap({ hires: true })
          map.sources = [id]
          return {
            code: str.toString(),
            map
          }
        } catch (e) {
          this.warn(`Unable to parse file ${id}`)
          return null
        }
      }
    }
  }
}