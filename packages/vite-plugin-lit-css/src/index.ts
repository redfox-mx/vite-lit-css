import { Plugin, PluginOption, createFilter } from 'vite';
import type { ExportSpecifier, ImportSpecifier } from 'es-module-lexer';
import { init, parse } from 'es-module-lexer';
import MagicString from 'magic-string';

export interface Options {
  include?: string | RegExp | Array<string | RegExp>
  exclude?: string | RegExp | Array<string | RegExp>
}

const litCssRE = /\.lit.css(?:$|\?)/;
const inlineRE = /(?:\?|&)inline\b/;
const tsRE = /\.tsx?$/;

function stripBomTag(content: string): string {
  if (content.charCodeAt(0) === 0xfeff) {
    return content.slice(1);
  }

  return content;
}

async function parseImports(source: string) {
  await init;
  source = stripBomTag(source);
  return parse(source);
}


export default function litCss(options: Options = {}): PluginOption {
  const filter = createFilter(options.include ?? litCssRE, options.exclude);
  // allow vite to process styles as inline content and
  // disables warning for vite:import-analysis
  const litImports: Plugin = {
    name: 'lit-css:import',
    enforce: 'pre',
    async transform(code, id) {
      if (id.includes('/node_modules/') || !tsRE.test(id)) return;

      let imports!: readonly ImportSpecifier[];
      try {
        [imports] = await parseImports(code);
      } catch {}

      imports.forEach(importSpecifier => {
        const {
          e: endImport,
          n: specifier
        } = importSpecifier;
        

        if(!filter(specifier) || !specifier) return;
        // prevent duplicated inline query
        if(inlineRE.test(specifier)) return;

        const query = specifier + specifier.includes('?') ? '?lit' : '&lit';
        code = code.slice(0, endImport) + query + code.slice(endImport);
      })

      return { code }
    },
  }

  const litTemplate: Plugin = {
    name: 'lit-css:template',
    enforce: 'post',
    async transform(code, id) {
      if(!filter(id) || id.includes('/node_modules/')) return

      let exports!: readonly ExportSpecifier[];
      try {
        [, exports] = await parseImports(code);
      } catch {}

      exports.forEach(exportSpecifier => {
        const {
          e: endExport,
          n: specifier
        } = exportSpecifier;

        if(!specifier) return;

        let css = code.slice(endExport + 2, -1); // remove quotes arround styles
        code = `import { css } from 'lit';
export const styles = css\`${css}\`;
export default styles;`
      })

      const map = (new MagicString(code))
        .generateMap()
        .toString();

      return { code, map };
    }
  }

  return [litImports];
}