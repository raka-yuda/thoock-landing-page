import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Exercise the deployed bytes, not just metadata in the build directory.
export async function checkReleaseHTTP(base, directory = 'public') {
  const local = path => readFile(resolve(directory, path), 'utf8');
  async function get(path, json = false) {
    const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000), redirect: 'error' });
    assert.equal(response.status, 200, `Release URL must return 200: ${path}`);
    if (json) {
      assert.match(response.headers.get('content-type') ?? '', /application\/json/, `Expected JSON: ${path}`);
      return response.json();
    }
    return Buffer.from(await response.arrayBuffer());
  }
  async function matchingJSON(path) {
    const expected = JSON.parse(await local(path));
    assert.deepEqual(await get(`/${path}`, true), expected, `Deployed manifest differs: ${path}`);
    return expected;
  }
  const index = await matchingJSON('releases/index.json');
  const latest = await matchingJSON('releases/latest.json');
  assert.equal(index.latestVersion, latest.version);
  for (const version of index.versions) {
    await matchingJSON(`releases/${version}.json`);
    const provenance = await matchingJSON(`downloads/${version}/build-manifest.json`);
    const sumsPath = `downloads/${version}/SHA256SUMS.txt`;
    assert.equal((await get(`/${sumsPath}`)).toString(), await local(sumsPath), `Deployed checksums differ: ${version}`);
    for (const artifact of provenance.artifacts) {
      const urls = [artifact.url];
      if (version === '0.1.0') urls.push(`/downloads/${artifact.filename}`);
      for (const url of urls) {
        const bytes = await get(url);
        assert.equal(bytes.length, artifact.bytes, `Download size differs: ${url}`);
        assert.equal(createHash('sha256').update(bytes).digest('hex'), artifact.sha256, `Download checksum differs: ${url}`);
      }
    }
    console.log(`HTTP release ${version}: manifests, checksums, and installer bytes verified.`);
  }
  await matchingJSON('downloads/build-manifest.json');
  assert.equal((await get('/downloads/SHA256SUMS.txt')).toString(), await local('downloads/SHA256SUMS.txt'));
  console.log(`HTTP latest: ${latest.version}; original v0.1.0 URLs preserved.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await checkReleaseHTTP(process.argv[2] ?? 'http://127.0.0.1:8080/');
}
