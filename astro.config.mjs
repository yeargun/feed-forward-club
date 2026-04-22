import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const env = loadEnv(
  process.env.NODE_ENV === 'production' ? 'production' : 'development',
  projectRoot,
  '',
);
const site =
  env.PUBLIC_SITE_URL ||
  'https://www.feedforwardclub.com';

// Absolute path so @use resolves from every component, regardless of location.
const tokensPath = fileURLToPath(new URL('./src/styles/_tokens.scss', import.meta.url))
  .replace(/\\/g, '/');

export default defineConfig({
  site,
  redirects: {},
  integrations: [sitemap()],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "${tokensPath}" as *;\n`,
        },
      },
    },
  },
});
