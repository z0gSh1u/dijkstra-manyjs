import { defineConfig } from 'vite'
import VitePluginWasm from 'vite-plugin-wasm'

export default defineConfig({
  plugins: [
    VitePluginWasm()
  ],
})