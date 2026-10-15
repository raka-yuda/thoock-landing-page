import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { test } from 'node:test';

const execute = promisify(execFile);
const script = fileURLToPath(new URL('./wait-for-http.sh', import.meta.url));

async function withServer(respond, verify) {
  const server = createServer(socket => {
    socket.once('data', () => respond(socket));
    socket.on('error', () => {});
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    await verify(`http://127.0.0.1:${server.address().port}/health`);
  } finally {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
}

function healthy(socket) {
  socket.end('HTTP/1.1 200 OK\r\nContent-Length: 2\r\nConnection: close\r\n\r\nok');
}

test('readiness accepts an immediately healthy server', async () => {
  await withServer(healthy, async url => {
    const { stdout } = await execute('bash', [script, url, '5'], { timeout: 8000 });
    assert.equal(stdout.trim(), 'ok');
  });
});

test('readiness survives connection resets before the server becomes healthy', async () => {
  let attempts = 0;
  await withServer(socket => {
    if (++attempts <= 2) socket.resetAndDestroy();
    else healthy(socket);
  }, async url => {
    const { stdout } = await execute('bash', [script, url, '5'], { timeout: 8000 });
    assert.equal(stdout.trim(), 'ok');
    assert.equal(attempts, 3);
  });
});

test('readiness fails within its retry budget when the server stays unhealthy', async () => {
  await withServer(socket => {
    socket.end('HTTP/1.1 503 Service Unavailable\r\nContent-Length: 0\r\nConnection: close\r\n\r\n');
  }, async url => {
    await assert.rejects(
      execute('bash', [script, url, '1'], { timeout: 8000 }),
      error => error.code === 22 && error.stderr.includes('503'),
    );
  });
});
