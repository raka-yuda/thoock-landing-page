import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { checkReleaseHTTP } from './check-release-http.mjs';

const latest = JSON.parse(await readFile('public/releases/latest.json', 'utf8'));
const firstDownload = Object.values(latest.downloads)[0].url;
async function server(overrides, run) {
  const http = createServer(async (request, response) => {
    const path = new URL(request.url, 'http://localhost').pathname;
    try {
      const override = overrides[path];
      response.statusCode = override?.status ?? 200;
      response.setHeader('Content-Type', path.endsWith('.json') ? 'application/json' : 'application/octet-stream');
      response.end(override?.body ?? await readFile(resolve('public', '.' + path)));
    } catch { response.statusCode = 404; response.end('Missing'); }
  });
  await new Promise(resolve => http.listen(0, '127.0.0.1', resolve));
  try { await run(`http://127.0.0.1:${http.address().port}/`); }
  finally { http.closeAllConnections(); await new Promise(resolve => http.close(resolve)); }
}

test('HTTP smoke check accepts all archived and legacy installers', async () => {
  await server({}, base => checkReleaseHTTP(base));
});
test('HTTP smoke check catches missing versioned installer routes', async () => {
  await server({ [firstDownload]: { status: 404, body: 'Missing' } }, async base => {
    await assert.rejects(checkReleaseHTTP(base), /Release URL must return 200/);
  });
});
test('HTTP smoke check catches corrupted installer bytes', async () => {
  const bytes = Buffer.from(await readFile(resolve('public', '.' + firstDownload)));
  bytes[0] ^= 1;
  await server({ [firstDownload]: { body: bytes } }, async base => {
    await assert.rejects(checkReleaseHTTP(base), /Download checksum differs/);
  });
});
test('HTTP smoke check catches stale latest metadata', async () => {
  await server({ '/releases/latest.json': { body: JSON.stringify({ ...latest, version: '0.0.0' }) } }, async base => {
    await assert.rejects(checkReleaseHTTP(base), /Deployed manifest differs/);
  });
});
