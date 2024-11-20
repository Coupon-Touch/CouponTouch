import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { compression } from 'vite-plugin-compression2';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), compression()],
  build: {
    outDir: './dist', // Output to the /front-end/dist directory
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080', // Proxy API requests to the Express server
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
