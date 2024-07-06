import { defineConfig } from 'vite'
import litCss from 'vite-plugin-lit-css'

export default defineConfig({
  plugins: [litCss({
    exclude: './src/index.css'
  })],
  css: {
    devSourcemap: true
  },
  build: {
    sourcemap: true
  }
})