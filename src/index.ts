import { type Plugin, isCSSRequest } from 'vite';
import { createFilter } from '@rollup/pluginutils';
import { isCssModule, isDirectCSSRequest, isInline } from './core/constants';
import { Engines, Engine, engines } from './core/engines';
import { sanitize } from './core/sanitize';
import { type Plugin as RollupPlugin } from 'rollup';

export interface Options {
  include?: string | RegExp | Array<string | RegExp>;
  exclude?: string | RegExp | Array<string | RegExp>;
  engine?: Engines | Engine;
  dts?: boolean;
}

const litCssRE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)/;

export default function lit(options: Options = {}): Plugin {
  const filter = createFilter(options.include ?? litCssRE, options.exclude);
  const engine = options.engine
    ? typeof options.engine === 'string'
      ? engines[options.engine] : options.engine
    : engines.lit;
  return {
    name: 'lit-styles',
    configResolved(config) {
      const cssPostPlugin = config.plugins.find(plugin => plugin.name === 'vite:css-post') as RollupPlugin;
      if (!cssPostPlugin?.transform) return;

      const cssPostTransformFn = typeof cssPostPlugin.transform === 'function' ? cssPostPlugin.transform : cssPostPlugin.transform.handler;
      const transformer: RollupPlugin['transform'] = async function (this, css, id, ...args) {
        if (!isCSSRequest(id)) return;

        if (
          isDirectCSSRequest(id) ||
          !filter(id) ||
          isInline(id)
        ) {
          return cssPostTransformFn.call(this, css, id, ...args);
        }

        if (isCssModule(id)) {
          // @ts-ignore
          this.error(`Unsupported css modules for vite-lit-css plugin with ${id} module specifier`);
          return cssPostTransformFn.call(this, css, id, ...args);
        }

        id += id.includes('?') ? '&inline' : '?inline';
        const codeOrResult  = await cssPostTransformFn.call(this, css, id, ...args);
        // preserve special queries from vite:css-post
        if (!codeOrResult) return codeOrResult;

        let code = typeof codeOrResult === 'string' ? codeOrResult : codeOrResult.code;
        if(!code) {
          return;
        }

        code = code.slice(16, -1); // remove `export default "(.*)"`
        code = [
          `import { ${engine.css} as __css } from '${engine.package}'`,
          `export default __css\`${sanitize(code)}\`;`
        ].join('\n');

        return {
          code,
          map: this.getCombinedSourcemap(),
          moduleSideEffects: false
        };
      };

      if(typeof cssPostPlugin.transform === 'function') {
        cssPostPlugin.transform = transformer;
      } else {
        cssPostPlugin.transform.handler = transformer;
      }
    },
  };
}
