import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import path from 'path';

export default defineConfig({
  define: {
    'process.env': {}
  },
  plugins: [
    vue(),
    vuetify({
      autoImport: true
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['vuetify'],
    entries: ['./src/**/*.vue']
  },
  build: {
    lib: {
      entry: './src/web-component.js',
      name: '{{options.package}}App',
      fileName: () => '{{options.package}}-app.js',
      formats: ['umd'],
    },
  },
  server: {
    host: true,
    port: 8080
  }
});