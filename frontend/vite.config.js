import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // Use the environment variable or fallback to localhost for development
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:5000';
  
  return {
    plugins: [react()],
    // Mobile-friendly development server settings
    server: {
      port: 3002,
      open: true,
      host: true, // Allow external connections for mobile testing
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: true,
        },
        '/socket.io': {
          target: backendUrl,
          changeOrigin: true,
          secure: true,
          ws: true // Enable WebSocket proxying
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled']
          }
        }
      }
    },
    base: './'
  };
});