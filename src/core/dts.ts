import { dirname } from 'path'
import { readFile, writeFile } from 'node:fs/promises'
import isThere from 'is-there'
import * as mkdirp from 'mkdirp'

export interface DtsOptions {
  modules: Record<string, string>
  dtsType?: string
}

export function createDts({ modules, dtsType }: DtsOptions) {
  // this type will be used as default export
  const defaultType = dtsType || 'any'

  return [
    ...Object.keys(modules)
      .map(key => `export declare const ${key}: string;`),
    `declare const __css: ${defaultType}`,
    `export default __css;`
  ].join('\n')
}

export async function writeDts(path: string, dts: string) {
  const source = path.split('?')[0]
  const outDir = dirname(source)
  const outFile = `${source}.d.ts`

  !isThere(outDir) && mkdirp.sync(outDir)

  let isDirty = false
  if(isThere(outFile)) {
    const content = await readFile(source, { encoding: 'utf-8' })
    if(content !== dts) {
      isDirty = true
    }
  } else {
    isDirty = true;
  }

  isDirty && await writeFile(outFile, dts, { encoding: 'utf-8' })
}