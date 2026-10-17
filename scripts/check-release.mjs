import { readFile, readdir, realpath, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, basename } from 'node:path';
import assert from 'node:assert/strict';

const json = async path => JSON.parse(await readFile(path, 'utf8'));
const latest = await json('public/releases/latest.json');
const index = await json('public/releases/index.json');
const root = await realpath('public/downloads');
const versionPattern = /^\d+\.\d+\.\d+(?:-[\w.-]+)?$/;
assert.equal(index.schemaVersion, 1, 'Unsupported archive schema');
assert.ok(Array.isArray(index.versions) && index.versions.length > 0, 'Release archive is empty');
assert.equal(new Set(index.versions).size, index.versions.length, 'Duplicate archived release');
assert.equal(index.latestVersion, index.versions[0], 'Latest release must be first');
assert.equal(index.latestVersion, latest.version, 'Latest release pointer differs');
const files = (await readdir('public/releases')).filter(name => versionPattern.test(name.replace(/\.json$/, '')) && name.endsWith('.json'));
assert.deepEqual(files.map(name => name.slice(0, -5)).sort(), [...index.versions].sort(), 'Archive index must list every release');
const checked = new Map();
async function artifactInfo(url, version) {
  assert.ok(url.startsWith(`/downloads/${version}/`) && !url.includes('?') && !url.includes('#'), `Non-versioned artifact: ${url}`);
  const path = await realpath(resolve('public', '.' + url));
  assert.ok(path.startsWith(`${root}/${version}/`), 'Download path escapes its version directory');
  if (!checked.has(path)) {
    const info = await stat(path);
    assert.ok(info.isFile(), 'Artifact must be a file');
    const hash = createHash('sha256');
    for await (const chunk of createReadStream(path)) hash.update(chunk);
    checked.set(path, { bytes: info.size, sha256: hash.digest('hex') });
  }
  return checked.get(path);
}
for (const version of index.versions) {
  assert.ok(versionPattern.test(version), 'Invalid archived version');
  const manifest = await json(`public/releases/${version}.json`);
  const provenance = await json(`public/downloads/${version}/build-manifest.json`);
  assert.equal(manifest.schemaVersion, 1, 'Unsupported release schema');
  assert.equal(manifest.version, version);
  assert.equal(provenance.version, version, 'Manifest and provenance versions differ');
  assert.ok(typeof manifest.notes === 'string' && manifest.notes.length > 0 && manifest.notes.length <= 12000, 'Release notes are required');
  assert.equal(manifest.notesUrl, '/changelog/', 'Invalid release notes URL');
  assert.equal((await readFile(`public/downloads/${version}/release-notes.md`, 'utf8')).trim(), manifest.notes.trim(), 'Release notes file differs');
  assert.ok(Object.keys(manifest.downloads).length > 0, 'No release downloads');
  assert.ok(provenance.artifacts.length > 0, 'No build artifacts');
  const seen = new Set();
  for (const artifact of provenance.artifacts) {
    assert.equal(artifact.filename, basename(artifact.url));
    assert.ok(artifact.filename.includes(`_${version}_`), 'Artifact filename version mismatch');
    assert.ok(!seen.has(artifact.url), 'Duplicate artifact');
    seen.add(artifact.url);
    const actual = await artifactInfo(artifact.url, version);
    assert.equal(actual.bytes, artifact.bytes, `Artifact size mismatch: ${artifact.url}`);
    assert.equal(actual.sha256, artifact.sha256, `Artifact checksum mismatch: ${artifact.url}`);
  }
  for (const [target, release] of Object.entries(manifest.downloads)) {
    assert.ok(['darwin-aarch64', 'darwin-x86_64', 'windows-x86_64'].includes(target), `Unknown target ${target}`);
    assert.equal(release.platform, target.startsWith('darwin') ? 'macOS' : 'Windows');
    assert.ok(release.architecture && release.note, 'Missing download description');
    for (const url of [release.url, release.alternativeUrl].filter(Boolean)) {
      const artifact = provenance.artifacts.find(item => item.url === url);
      assert.ok(artifact, `Missing provenance: ${url}`);
      assert.equal(artifact.platform, release.platform, 'Artifact platform mismatch');
      if (url === release.url) {
        assert.equal(release.bytes, artifact.bytes);
        assert.equal(release.sha256, artifact.sha256);
      }
    }
  }
  const expectedSums = provenance.artifacts.map(item => `${item.sha256}  ${item.filename}`).join('\n') + '\n';
  assert.equal(await readFile(`public/downloads/${version}/SHA256SUMS.txt`, 'utf8'), expectedSums, 'Checksum list differs');
  assert.ok(Buffer.byteLength(JSON.stringify(manifest)) <= 65536, 'Manifest exceeds desktop limit');
  if (version === latest.version) {
    assert.deepEqual(latest, manifest, 'Latest manifest differs from immutable version');
    assert.deepEqual(await json('public/downloads/build-manifest.json'), provenance, 'Latest provenance alias differs');
    assert.equal(await readFile('public/downloads/SHA256SUMS.txt', 'utf8'), expectedSums, 'Latest checksum alias differs');
  }
  console.log(`Release ${version}: artifact sizes, checksums, and provenance verified.`);
}
console.log(`Latest: ${latest.version}. Verified ${index.versions.length} archived releases.`);
