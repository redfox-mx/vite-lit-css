import { init, parse } from 'es-module-lexer';

export async function parseImports(source: string) {
  await init;
  source = source.charCodeAt(0) === 0xfeff ? source.slice(1) : source;
  return parse(source);
}

export function addQueryPart(path: string, key: string){
  const hasQuery = (new RegExp(`(?:\\?|&)${key}\\b`)).test(path);

  if(hasQuery) return path;

  return path.includes('?') ? `&${key}` : `?${key}`;
}

export function createCssTemplate(css: string) {
  return [
    `import { css } from 'lit';`,
    `export default css\`\n${css}\`;`
  ].join('\n');
}