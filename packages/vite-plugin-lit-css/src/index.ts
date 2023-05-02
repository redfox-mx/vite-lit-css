import { PluginOption, createFilter } from 'vite';
import MagicString from 'magic-string';

import { parseImports, addQueryPart, createCssTemplate } from './utils';

export interface Options {
  include?: string | RegExp | Array<string | RegExp>
  exclude?: string | RegExp | Array<string | RegExp>
}

const litCssRE = /\.lit.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/;
const inlineRE = /(?:\?|&)inline\b/
const jsRE = /\.[tj]sx?$/;

const isJsLike = (id: string) =>
  jsRE.test(id);

export default function litCss(options: Options = {}): PluginOption {
  const filter = createFilter(options.include ?? litCssRE, options.exclude);
  return {
    name: 'lit-css',
    configResolved(config) {
      const csssPostPlugin = config.plugins.find(plugin => plugin.name === 'vite:css-post')
      if (!csssPostPlugin) return;

      const cssTransforFn = csssPostPlugin.transform as any;
      csssPostPlugin.transform = async function (code, id, options) {
        if (id.includes('/node_modules/') || !filter(id)) return cssTransforFn.apply(this, [code, id, options]);

        if (config.command === 'serve') {
          return createCssTemplate(code);
        }

        const result = await cssTransforFn.apply(this, [code, id, options]);
        let css: string = typeof result === 'string' ? result : result.code;
        css = css.slice(16, -1)
        return {
          code: createCssTemplate(css),
          moduleSideEffects: false
        }
      }

    },
    async transform(code, id) {
      if (id.includes('/node_modules/') || !isJsLike(id)) return;

      const str = new MagicString(code);

      try {
        let [imports] = await parseImports(code);
        imports.forEach(importSpecifier => {
          const {
            e: endImport,
            n: specifier,
          } = importSpecifier;

          if (
            !specifier ||
            inlineRE.test(specifier) ||
            !filter(specifier)
          ) return;
          str.appendLeft(endImport, addQueryPart(specifier, 'inline'))
        })

        return str.toString();
      } catch {
        this.warn({ message: 'Unable to parse file', id });
        return null;
      }
    }
  }
}