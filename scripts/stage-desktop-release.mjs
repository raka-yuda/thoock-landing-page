// Stage verified local installers. This does not deploy, commit, or push.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile, writeFile, copyFile, mkdir, mkdtemp, rename, rm, stat } from 'node:fs/promises';
import { resolve, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import assert from 'node:assert/strict';

const landing = fileURLToPath(new URL('../', import.meta.url));
const { values } = parseArgs({ options: {
  desktop: { type: 'string', default: '../thoock-desktop-app' },
  'mac-app': { type: 'string' }, 'mac-dmg': { type: 'string' },
  'windows-installer': { type: 'string' }, 'windows-exe': { type: 'string' },
} });
const desktop = resolve(landing, values.desktop);
const json = async path => JSON.parse(await readFile(path, 'utf8'));
const pkg = await json(join(desktop, 'package.json'));
const version = pkg.version;
assert.match(version, /^\d+\.\d+\.\d+$/, 'Use a stable three-part preview version');
assert.equal((await json(join(desktop, 'src-tauri/tauri.conf.json'))).version, version);
assert.equal((await json(join(desktop, 'package-lock.json'))).version, version);
const cargo = await readFile(join(desktop, 'src-tauri/Cargo.toml'), 'utf8');
const lock = await readFile(join(desktop, 'src-tauri/Cargo.lock'), 'utf8');
assert.ok(cargo.includes(`name = "thoock-desktop-app"\nversion = "${version}"`));
assert.ok(lock.includes(`name = "thoock-desktop-app"\nversion = "${version}"`));
const destination = join(landing, 'public/downloads', version);
const versionManifest = join(landing, 'public/releases', `${version}.json`);
async function absent(path) {
  try { await stat(path); } catch (error) { if (error.code === 'ENOENT') return; throw error; }
  throw new Error(`Version already exists; never overwrite ${path}`);
}
await absent(destination);
await absent(versionManifest);
assert.equal(process.platform, 'darwin', 'Staging both platforms requires macOS archive verification');
const macApp = resolve(values['mac-app'] ?? join(desktop, 'src-tauri/target/release/bundle/macos/Thoock.app'));
const macDmg = resolve(values['mac-dmg'] ?? join(desktop, `src-tauri/target/release/bundle/dmg/Thoock_${version}_aarch64.dmg`));
const winBase = join(desktop, 'src-tauri/target/windows-cross/x86_64-pc-windows-msvc/release');
const winInstaller = resolve(values['windows-installer'] ?? join(winBase, `bundle/nsis/Thoock_${version}_x64-setup.exe`));
const winExe = resolve(values['windows-exe'] ?? join(winBase, 'thoock-desktop-app.exe'));
const run = (bin, args, cwd = landing) => execFileSync(bin, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' }).trim();
assert.equal(run('/usr/libexec/PlistBuddy', ['-c', 'Print :CFBundleShortVersionString', join(macApp, 'Contents/Info.plist')]), version);
run('/usr/bin/codesign', ['--verify', '--strict', '--verbose=2', macApp]);
run('/usr/bin/hdiutil', ['verify', macDmg]);
const executable = join(macApp, 'Contents/MacOS/thoock-desktop-app');
assert.ok(run('/usr/bin/lipo', ['-archs', executable]).includes('arm64'));
const minimumOS = run('/usr/bin/vtool', ['-show-build', executable]).match(/minos\s+(\S+)/)?.[1];
assert.ok(minimumOS, 'Missing Mach-O deployment target');
function pe(bytes) {
  assert.equal(bytes.toString('ascii', 0, 2), 'MZ');
  const offset = bytes.readUInt32LE(0x3c);
  assert.equal(bytes.toString('ascii', offset, offset + 4), 'PE\0\0');
  const optional = offset + 24;
  const dirs = optional + (bytes.readUInt16LE(optional) === 0x20b ? 112 : 96);
  return { machine: `0x${bytes.readUInt16LE(offset + 4).toString(16)}`, authenticodePresent: Boolean(bytes.readUInt32LE(dirs + 32) && bytes.readUInt32LE(dirs + 36)) };
}
const windowsAppPE = pe(await readFile(winExe));
const windowsInstallerPE = pe(await readFile(winInstaller));
function windowsVersion(bytes) {
  const key = Buffer.from('VS_VERSION_INFO\0', 'utf16le');
  const start = bytes.indexOf(key);
  assert.ok(start >= 0, 'Windows version resource is missing');
  const fixed = (start + key.length + 3) & ~3;
  assert.equal(bytes.readUInt32LE(fixed), 0xfeef04bd, 'Invalid Windows version resource');
  const majorMinor = bytes.readUInt32LE(fixed + 8);
  const patchBuild = bytes.readUInt32LE(fixed + 12);
  return `${majorMinor >>> 16}.${majorMinor & 0xffff}.${patchBuild >>> 16}`;
}
assert.equal(windowsVersion(await readFile(winExe)), version, 'Windows executable version differs');
assert.equal(windowsVersion(await readFile(winInstaller)), version, 'Windows installer version differs');
assert.equal(windowsAppPE.machine, '0x8664', 'Windows app must be x64');
const stage = await mkdtemp(join(landing, 'public/downloads', `.stage-${version}-`));
try {
  execFileSync('npm', ['run', 'build'], { cwd: desktop, stdio: 'inherit' });
  const tests = join(stage, 'unit-results.json');
  execFileSync('npm', ['test', '--', '--reporter=json', `--outputFile=${tests}`], { cwd: desktop, stdio: 'inherit' });
  const results = await json(tests);
  assert.equal(results.numFailedTests, 0);
  assert.ok(results.numPassedTests > 0);
  await rm(tests);
  const definitions = [
    [`Thoock_${version}_macos_arm64.dmg`, 'macOS', 'arm64', 'dmg', macDmg],
    [`Thoock_${version}_macos_arm64.zip`, 'macOS', 'arm64', 'zip', null],
    [`Thoock_${version}_windows_x64_setup.exe`, 'Windows', 'x64', 'nsis', winInstaller],
  ];
  const artifacts = [];
  for (const [filename, platform, architecture, format, source] of definitions) {
    const path = join(stage, filename);
    if (source) await copyFile(source, path);
    else {
      run('/usr/bin/ditto', ['-c', '-k', '--sequesterRsrc', '--keepParent', macApp, path]);
      run('/usr/bin/unzip', ['-t', path]);
    }
    const hash = createHash('sha256');
    for await (const chunk of createReadStream(path)) hash.update(chunk);
    artifacts.push({ filename, url: `/downloads/${version}/${filename}`, platform, architecture, format, bytes: (await stat(path)).size, sha256: hash.digest('hex') });
  }
  const git = (...args) => run('git', args, desktop);
  const sourceHash = createHash('sha256');
  for (const file of git('ls-files', '--cached', '--others', '--exclude-standard').split('\n').filter(Boolean).sort()) {
    try { sourceHash.update(file + '\0'); sourceHash.update(createHash('sha256').update(await readFile(join(desktop, file))).digest()); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  const provenance = { product: 'Thoock', version, buildType: 'release-preview', builtAt: new Date().toISOString(), sourceRevision: git('rev-parse', 'HEAD'), sourceHasUncommittedChanges: Boolean(git('status', '--porcelain')), sourceSnapshotSha256: sourceHash.digest('hex'), verification: {
    frontendBuild: true, uiUnitTestsPassed: results.numPassedTests,
    macOSCodeSignature: 'verified-ad-hoc', macOSNotarized: false, macOSArchiveIntegrity: 'verified', macOSExecutableMinimumOS: minimumOS,
    windowsAppPE, windowsInstallerPE, windowsRuntimeTested: false, workspaceDataIncluded: false,
  }, artifacts };
  const notes = await readFile(join(desktop, 'docs/releases', `${version}.md`), 'utf8');
  const downloads = {};
  for (const artifact of artifacts.filter(item => item.format !== 'zip')) {
    downloads[artifact.platform === 'macOS' ? 'darwin-aarch64' : 'windows-x86_64'] = {
      platform: artifact.platform,
      architecture: artifact.platform === 'macOS' ? 'Apple silicon (ARM64)' : '64-bit (x64)',
      url: artifact.url, bytes: artifact.bytes, sha256: artifact.sha256,
      note: artifact.platform === 'macOS' ? 'Release preview. Ad hoc signed; not notarized. Apple silicon. Background removal requires macOS 13.3 or later.' : 'Release preview. Unsigned installer; Windows runtime testing is pending.',
      ...(artifact.platform === 'macOS' ? { alternativeUrl: artifacts.find(item => item.format === 'zip').url } : {}),
    };
  }
  const manifest = { schemaVersion: 1, version, notes, notesUrl: '/changelog/', downloads };
  assert.ok(Buffer.byteLength(JSON.stringify(manifest)) <= 65536);
  const text = value => JSON.stringify(value, null, 2) + '\n';
  const sums = artifacts.map(item => `${item.sha256}  ${item.filename}`).join('\n') + '\n';
  await writeFile(join(stage, 'build-manifest.json'), text(provenance));
  await writeFile(join(stage, 'SHA256SUMS.txt'), sums);
  await writeFile(join(stage, 'release-notes.md'), notes);
  await rename(stage, destination);
  await writeFile(versionManifest, text(manifest), { flag: 'wx' });
  const index = await json(join(landing, 'public/releases/index.json'));
  assert.ok(!index.versions.includes(version));
  index.versions.unshift(version);
  index.latestVersion = version;
  // Artifacts and immutable manifest exist before moving the local latest pointer.
  await writeFile(join(landing, 'public/downloads/build-manifest.json'), text(provenance));
  await writeFile(join(landing, 'public/downloads/SHA256SUMS.txt'), sums);
  await writeFile(join(landing, 'public/releases/index.json'), text(index));
  await writeFile(join(landing, 'public/releases/latest.json'), text(manifest));
  console.log(`Staged ${version} in ${destination}; preserved ${index.versions.length - 1} older releases.`);
} finally { await rm(stage, { recursive: true, force: true }); }
