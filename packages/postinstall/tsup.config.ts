import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'], // Output format: ECMAScript Module
  dts: true, // Generate TypeScript definition files (.d.ts)
  splitting: false, // Prevent code splitting into multiple chunks
  sourcemap: true, // Generate source maps
  clean: true, // Clean output directory before build
  treeshake: true, // Remove unused code
  esbuildOptions(options) {
    // This helps with proper path resolution for ESM
    options.platform = 'node';
    options.format = 'esm';
  },
});
