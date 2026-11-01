import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, writeFile, readFile, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { test } from 'node:test';

const execute = promisify(execFile);
const script = fileURLToPath(new URL('./deploy.sh', import.meta.url));
const ref = letter => `thoock-landing-page:${letter.repeat(40)}`;
const images = [ref('a') + ' sha256:new', ref('b') + ' sha256:recent', ref('c') + ' sha256:previous', ref('d') + ' sha256:used', ref('e') + ' sha256:obsolete', 'portfolio-v2:latest sha256:portfolio', 'thoock-landing-page:latest sha256:legacy'];

async function deploy(fixture, verify) {
  const dir = await mkdtemp(join(tmpdir(), 'thoock-deploy-test-'));
  try {
    const log = join(dir, 'calls.jsonl');
    const archive = join(dir, 'image.tar.gz');
    await writeFile(archive, 'fixture');
    await writeFile(join(dir, 'docker'), `#!${process.execPath}
const fs = require('node:fs');
const a = process.argv.slice(2), fixture = JSON.parse(process.env.FIXTURE);
fs.appendFileSync(process.env.LOG, JSON.stringify(a)+'\\n');
if(a[0]==='compose' && a.includes('ps')) console.log(fixture.first ? '' : 'previous-container');
else if(a[0]==='inspect') console.log(a.at(-1)==='previous-container' ? 'sha256:previous' : 'sha256:used');
else if(a[0]==='compose' && a.includes('up') && fixture.failHealth) process.exit(1);
else if(a[0]==='ps') console.log('other-container');
else if(a[0]==='image' && a[1]==='inspect') console.log('sha256:new');
else if(a[0]==='image' && a[1]==='ls') { if(fixture.failList) process.exit(1); console.log(fixture.images.join('\\n')); }
else if(a[0]==='image' && a[1]==='rm' && fixture.failRemove) process.exit(1);
`, { mode: 0o755 });
    const result = await execute('bash', [script], { env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, THOOCK_IMAGE: ref('a'), IMAGE_ARCHIVE: archive, LOG: log, FIXTURE: JSON.stringify({ images, ...fixture }) } }).then(r => ({ ...r, code: 0 }), e => ({ code: e.code, stderr: e.stderr }));
    const calls = (await readFile(log, 'utf8')).trim().split('\n').map(JSON.parse);
    await verify({ result, calls, archive });
  } finally { await rm(dir, { recursive: true, force: true }); }
}
const removals = calls => calls.filter(a => a[0] === 'image' && a[1] === 'rm').map(a => a[2]);

test('successful deployment protects current, actual rollback and container images; removes only old Thoock tags', async () => {
  await deploy({}, async ({ result, calls, archive }) => {
    assert.equal(result.code, 0);
    assert.deepEqual(removals(calls), [ref('b'), ref('e')]);
    assert.ok(calls.findIndex(a => a.includes('up')) < calls.findIndex(a => a.includes('rm')));
    assert.ok(!calls.some(a => a.includes('--force') || a.includes('prune')));
    await assert.rejects(access(archive));
  });
});
test('failed health check preserves all images and the uploaded archive', async () => {
  await deploy({ failHealth: true }, async ({ result, calls, archive }) => {
    assert.notEqual(result.code, 0);
    assert.deepEqual(removals(calls), []);
    await access(archive);
  });
});
test('first deployment retains one recent rollback candidate', async () => {
  await deploy({ first: true }, ({ result, calls }) => {
    assert.equal(result.code, 0);
    assert.deepEqual(removals(calls), [ref('c'), ref('e')]);
  });
});
test('cleanup failures do not fail a healthy deployment', async () => {
  for (const fixture of [{ failList: true }, { failRemove: true }]) {
    await deploy(fixture, ({ result }) => {
      assert.equal(result.code, 0);
      assert.match(result.stderr, /Warning:/);
    });
  }
});
