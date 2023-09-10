import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [react()],
    server: {
      https: {
        cert: readFileSync('ssl-localhost/localhost.crt'),
        key: readFileSync('ssl-localhost/localhost.key')
      }
    }
  };
});