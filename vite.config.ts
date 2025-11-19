import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Optimize build output
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug'],
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Optimize chunking strategy
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'chart-vendor': ['recharts'],
          'icons-vendor': ['lucide-react'],
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Enable source maps for production debugging (can be disabled for smaller builds)
    sourcemap: false,
    // Optimize CSS code splitting
    cssCodeSplit: true,
    // Optimize asset inlining threshold (4KB)
    assetsInlineLimit: 4096,
  },
  // Performance optimizations for dev server
  server: {
    port: 5173,
    strictPort: false,
    open: false,
    cors: true,
    // Enable HMR
    hmr: {
      overlay: true,
    },
  },
  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: false,
    open: false,
  },
});
