import { defineConfig } from 'vite'
import inspect from 'vite-plugin-inspect'
import litcss from '../src'

export default defineConfig({
  plugins: [
    litcss({
      dts: true
    }),
    inspect({
      build: true,
    })
  ],
})