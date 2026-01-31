import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '127.0.0.1', // Use IPv4 instead of IPv6
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
