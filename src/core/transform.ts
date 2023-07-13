import { dataToEsm } from '@rollup/pluginutils'

import { sanitize } from './sanitize'


export interface Options {
  css: string
  package: string
}

export function css(css: string, options: Options) {
  return [
    `import { ${options.css} as __css } from '${options.package}'`,
    `export default __css\`${sanitize(css)}\`;`
  ].join('\n')
}

export function cssModules(modules?: Record<string, string>) {
  if(!modules) return '';
  const esModules = dataToEsm(modules, { namedExports: true, preferConst: true })

  return esModules.slice(0, esModules.indexOf('export default'))
}