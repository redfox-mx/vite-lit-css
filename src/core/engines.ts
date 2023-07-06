export type Engine = {
  css: string
  package: string
  dtsType?: string
}

export const engines  = {
  lit: {
    css: 'css',
    package: 'lit',
    dtsType: `import('lit').CSSResult`
  },
  fast: {
    css: 'css',
    package: '@microsoft/fast-element',
  },
  ['lit-element']: {
    css: 'css',
    package: 'lit-element',
  }
} as const

export type Engines = keyof typeof engines