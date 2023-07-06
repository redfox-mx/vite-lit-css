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
  return modules ?
    dataToEsm(modules, { namedExports: true, preferConst: true })
      // TODO: find a better way to remove `export default { ... }`
      .replace(/export default .*/s, '') : ''
}