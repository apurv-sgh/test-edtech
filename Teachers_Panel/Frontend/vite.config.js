import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port:5174,         //Default Port for Development.
    strictPort: false, //Dynamic shifting of ports.
    host: true,        //Port for Network.
  }
})