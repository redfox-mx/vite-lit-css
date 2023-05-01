import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import litCss from '../../packages/vite-plugin-lit-css/src'

export default defineConfig({
  plugins: [
    Inspect({
      build: true,
    }),
    litCss()
  ],
})