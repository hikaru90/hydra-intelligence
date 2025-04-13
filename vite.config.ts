import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import path from 'path';

export default defineConfig({
  plugins: [
    paraglideVitePlugin({ project: "./project.inlang", outdir: "./src/paraglide" }),
    tailwindcss(),
    sveltekit(),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      $src: path.resolve('./src'),
      $store: path.resolve('./src/lib/stores')
    }
  },
});
