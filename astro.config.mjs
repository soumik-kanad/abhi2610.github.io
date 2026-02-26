import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://abhi2610.github.io',
  output: 'static',
  integrations: [sitemap()],
});