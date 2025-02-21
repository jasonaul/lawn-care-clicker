import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public/', // Set root to 'public/'
  publicDir: 'public', // Explicitly set publicDir
  build: {
    outDir: '../dist', // Output directory relative to the project root
    emptyOutDir: true, // Clean output directory on build
    sourcemap: true, // Enable sourcemaps for debugging
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]', // Customize asset file names
        chunkFileNames: 'assets/js/[name]-[hash].js',    // Customize chunk file names
        entryFileNames: 'assets/js/[name]-[hash].js',    // Customize entry file names
      },
    },
  },
  server: {
    port: 3000, // Development server port
    open: true,  // Automatically open browser on start
  },
  optimizeDeps: {
    include: ['phaser'], // Optimize Phaser during development
  },
});
