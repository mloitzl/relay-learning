import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Terminal from 'vite-plugin-terminal';

export default defineConfig({
  plugins: [
    react({ babel: { plugins: ["relay"] } }),
    Terminal()
  ],
  server: {
    port: 5173,
    host: '0.0.0.0',
  },
});
