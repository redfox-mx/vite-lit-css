import { defineConfig } from 'vite'
import inspect from 'vite-plugin-inspect'
import litcss from '../src'

export default defineConfig({
  plugins: [
    litcss({
      exclude: [/global.css/],
      dts: true
    }),
    inspect({
      build: true,
    })
  ],
})