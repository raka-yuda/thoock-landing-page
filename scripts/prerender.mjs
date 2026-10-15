import { readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';

const server = await createServer({
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: 'custom',
});
try {
  const { renderPage } = await server.ssrLoadModule('/src/entry-server.tsx');
  for (const [pathname, output] of [['/', 'dist/index.html'], ['/changelog', 'dist/changelog/index.html']]) {
    const template = await readFile(output, 'utf8');
    const markup = renderPage(pathname);
    await writeFile(output, template.replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${markup}</div>`));
    console.log(`Prerendered ${pathname}`);
  }
} finally {
  await server.close();
}
