import { fileURLToPath, URL } from 'node:url';

import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 80
  },
  optimizeDeps: {
    noDiscovery: true,
    include: ['pbf', 'xml-utils/get-attribute.js', 'xml-utils/find-tags-by-name.js','earcut']
    
  },
  plugins: [
    vue(),
    Components({
      resolvers: [PrimeVueResolver()]
    })
  ],
  resolve: {
    alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})
