import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from 'node:url'

// Two modes:
//  - default: run the demo app (index.html) for local development, with
//    vite-plugin-vuetify auto-importing the Vuetify components it uses.
//  - lib:     build the embeddable component bundle. Vue and Vuetify are
//    external — the host app provides them (and registers Vuetify's
//    components globally), so no auto-import here.
export default defineConfig(({ mode }) => {
  const lib = mode === 'lib'
  return {
    plugins: [vue(), ...(lib ? [] : [vuetify({ autoImport: true })])],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: lib
      ? {
          lib: {
            entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
            name: 'CddOntologyEditor',
            fileName: 'ontology-editor',
          },
          rollupOptions: {
            external: [/^vue(\/.*)?$/, /^vuetify(\/.*)?$/],
            output: { globals: { vue: 'Vue', vuetify: 'Vuetify' } },
          },
        }
      : {},
  }
})
