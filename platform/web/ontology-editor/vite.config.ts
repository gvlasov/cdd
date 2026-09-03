import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from 'node:url'

// Two modes:
//  - default: run the demo app (index.html) for local development
//  - lib:     build the embeddable component bundle (see build:lib script)
export default defineConfig(({ mode }) => ({
  plugins: [vue(), vuetify({ autoImport: true })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build:
    mode === 'lib'
      ? {
          lib: {
            entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
            name: 'CddOntologyEditor',
            fileName: 'ontology-editor',
          },
          rollupOptions: {
            external: ['vue', 'vuetify'],
            output: { globals: { vue: 'Vue', vuetify: 'Vuetify' } },
          },
        }
      : {},
}))
