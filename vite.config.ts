import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
export default defineConfig({
  plugins: [
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
