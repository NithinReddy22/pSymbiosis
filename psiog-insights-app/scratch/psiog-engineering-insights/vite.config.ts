import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/api/dashboard': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // Forward /api/jira/* to the backend (same server as /api/dashboard).
      // Update the target URL to match wherever your backend is running.
      '/api/jira': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
