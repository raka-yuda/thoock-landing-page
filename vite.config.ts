import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
function umamiAnalytics(): Plugin {
  let settings: { scriptUrl: string; websiteId: string } | null = null;
  return {
    name: 'thoock-umami',
    apply: 'build',
    configResolved(config) {
      const scriptUrl = config.env.VITE_UMAMI_SCRIPT_URL?.trim();
      const websiteId = config.env.VITE_UMAMI_WEBSITE_ID?.trim();
      if (Boolean(scriptUrl) !== Boolean(websiteId)) throw new Error('Set both VITE_UMAMI_SCRIPT_URL and VITE_UMAMI_WEBSITE_ID, or leave both empty.');
      if (scriptUrl && (new URL(scriptUrl).protocol !== 'https:' || !/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(websiteId))) {
        throw new Error('Umami requires an HTTPS script URL and a valid website UUID.');
      }
      settings = scriptUrl && websiteId ? { scriptUrl, websiteId } : null;
    },
    transformIndexHtml() {
      if (!settings) return;
      return [{ tag: 'script', injectTo: 'head', attrs: {
        defer: true, src: settings.scriptUrl, 'data-website-id': settings.websiteId,
        'data-domains': 'thoock.ryuda.me', 'data-exclude-hash': 'true',
      } }];
    },
  };
}

export default defineConfig({
  plugins: [
    umamiAnalytics(),
    react(),
    {
      name: 'thoock-release-data',
      resolveId(id) {
        if (id === 'virtual:thoock-releases') return '\0thoock-releases';
      },
      async load(id) {
        if (id !== '\0thoock-releases') return;
        const loadJSON = async (name: string) => {
          const path = fileURLToPath(new URL(`./public/releases/${name}.json`, import.meta.url));
          this.addWatchFile(path);
          return JSON.parse(await readFile(path, 'utf8'));
        };
        const index = await loadJSON('index');
        const latest = await loadJSON('latest');
        const history = await Promise.all(index.versions.map((version: string) => loadJSON(version)));
        // Public JSON remains canonical; expose it through Vite's module pipeline
        // instead of importing static public assets as JavaScript in development.
        return `export const latest = ${JSON.stringify(latest)}; export const history = ${JSON.stringify(history)};`;
      },
    },
    {
      name: 'thoock-html',
      apply: 'serve',
      configurePreviewServer(server) {
        server.middlewares.use((request, response, next) => {
          const url = new URL(request.url ?? '/', 'http://localhost');
          if (url.pathname !== '/changelog') return next();
          // The directory index is canonical; SPA fallback must not serve the
          // homepage's prerendered HTML for the changelog route.
          response.writeHead(308, { Location: `/changelog/${url.search}` });
          response.end();
        });
      },
      configureServer(server) {
        server.middlewares.use(async (request, response, next) => {
          const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
          if (request.method !== 'GET' || !['/', '/index.html', '/changelog', '/changelog/', '/changelog/index.html'].includes(pathname)) return next();
          try {
            const changelog = pathname.startsWith('/changelog');
            const file = changelog ? './changelog/index.html' : './index.html';
            const template = await server.transformIndexHtml(pathname, await readFile(fileURLToPath(new URL(file, import.meta.url)), 'utf8'));
            const { renderPage } = await server.ssrLoadModule('/src/entry-server.tsx');
            const markup = renderPage(changelog ? '/changelog' : '/');
            response.setHeader('Content-Type', 'text/html; charset=utf-8');
            response.end(template.replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${markup}</div>`));
          } catch (error) {
            next(error);
          }
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        changelog: fileURLToPath(new URL('./changelog/index.html', import.meta.url)),
      },
    },
  },
});
