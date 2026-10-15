import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
export default defineConfig({
  plugins: [
    react(),
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
