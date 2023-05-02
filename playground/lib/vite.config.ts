import { defineConfig } from 'vite'
import { resolve } from 'path';
import litCss from 'vite-plugin-lit-css'

export default defineConfig({
  plugins: [litCss()],
  build: {
    lib: {
      name: 'LitCssText',
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'lcss-text',
    },
    rollupOptions: {
      external: [/^lit/],
    }
  }
})