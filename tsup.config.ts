import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm', 'cjs'],
  target: 'node16.14',
  clean: true,
  dts: true,
  splitting: true,
  cjsInterop: true,
  shims: true,
})