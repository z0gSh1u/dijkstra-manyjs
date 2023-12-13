import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import VitePluginWasm from 'vite-plugin-wasm'
import VitePluginPlainText from 'vite-plugin-plain-text'

export default defineConfig({
  plugins: [
    react(),
    VitePluginWasm(),
    VitePluginPlainText([/\.glsl$/, /\.wgsl$/], {
      namedExport: false,
    }),
  ],
})
