import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Listen on all interfaces (incl. IPv4 127.0.0.1) so the dev/preview server is
  // reachable regardless of how the browser resolves "localhost".
  server: { host: true },
  preview: { host: true },
});
