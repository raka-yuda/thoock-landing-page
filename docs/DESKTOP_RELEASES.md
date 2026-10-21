# Desktop downloads and update notifications

Production origin: https://thoock.ryuda.me
Public manifest: https://thoock.ryuda.me/releases/latest.json

`public/releases/latest.json` is the source of truth for **published installers**.
`src/releases.ts` imports it at build time for landing page download buttons.
The desktop app reads it over HTTPS for optional startup checks or manual checks
in Settings → About & updates. No update API, account, or database is needed.
Versioned manifests live at `public/releases/<version>.json`; the ordered
`public/releases/index.json` lists retained versions. Each version owns
`public/downloads/<version>/` with installers, checksums, release notes and build
provenance. The homepage shows the latest version; the changelog provides older
version downloads. The original flat 0.1.0 installer URLs are preserved unchanged.

## Shared platform version

Thoock uses one app version for Apple silicon macOS and Windows x64. Build both
platforms for each feature or patch release, including a platform-specific hotfix.
Release notes identify which platform receives the behavior fix. For 0.2.1 the
user-facing fix concerns Windows background-removal downloads; macOS was rebuilt
with the same version. The staging checks inspect the actual executable versions;
renaming an older installer is not a version update.

Keep installer bytes and recorded hashes unchanged after staging. Editorial
release-note clarifications must stay synchronized between the version's notes
file, its release manifest, the latest alias when applicable, and the changelog.
They do not require rebuilding or replacing unchanged installers.

## Prepare a release locally

1. Finish the desktop changes and choose a new version. Set the same value in
   desktop `package.json`, `package-lock.json`, `src-tauri/Cargo.toml`,
   `Cargo.lock`, and `src-tauri/tauri.conf.json`. Add plain-text release notes at
   desktop `docs/releases/<version>.md` and a matching landing `src/changelog.ts`
   entry. Never reuse an existing version for different binaries.
2. Build the Apple silicon macOS app/DMG and Windows x64 NSIS installer. For the
   current local cross-compilation setup, install Rust's Windows MSVC target,
   cargo-xwin, LLVM/LLD, a Windows SDK cache, and NSIS. Typical commands:

   ```sh
   # In the desktop project (macOS)
   npm run tauri -- build --bundles app,dmg --config src-tauri/tauri.macos.dev.conf.json
   CARGO_TARGET_DIR=src-tauri/target/windows-cross npm run tauri -- build --runner cargo-xwin --target x86_64-pc-windows-msvc --bundles nsis
   ```

3. In the landing project run `npm run release:stage`. The script defaults to
   sibling `../thoock-desktop-app` and its standard build output paths. Optional
   flags: `--desktop`, `--mac-app`, `--mac-dmg`, `--windows-installer`, and
   `--windows-exe`. When using native CI artifacts, `--windows-ci-provenance` records the verified artifact digest and run URL, and requires its source revision to match the desktop checkout. It refuses to overwrite an existing version, verifies app
   versions/architectures, the macOS signature and DMG, runs the frontend build
   and unit tests, creates/checks the ZIP, and computes artifact SHA-256 values.
   It stages files first, then writes the version manifest and updates the local
   latest pointer and root metadata aliases. The source revision and dirty-tree
   fingerprint are recorded; uncommitted builds are identified honestly.
4. The script does not test Windows execution or an installed-app upgrade. Verify
   those on the target systems with a backed-up workspace before treating this
   preview as a fully tested release. Read each version's provenance for actual
   checks. Retained older installers do not roll back migrated workspace data.
5. Run `npm run release:check` and `npm run build`. Validation checks **all**
   indexed versions, every artifact's size/hash, version-directory containment,
   checksum lists, provenance, and latest aliases. Test `tests/releases.spec.ts`
   and the installer/changelog browser checks. Preserve the existing flat 0.1.0
   binaries and every version directory.

## Deploy the prepared release

Upload or deploy the entire landing `dist/` after verification. Every retained
version is copied by Vite; deploying only the newest artifacts would break old
links. Upload versioned artifacts before the latest manifest, or use an atomic
website release switch. Check the public JSON and actual download URLs afterward.
For future releases, use the previous checker-enabled app to verify the update
announcement. The old 0.1.0 app predates the checker and needs manual installation
of 0.2.0 or later.

Building or staging locally does not deploy to the VPS, commit, or push. No
provider keys, user workspaces or deployment credentials belong in the installers.
Root `/downloads/build-manifest.json` and `/downloads/SHA256SUMS.txt` are mutable
latest-version aliases; use versioned paths for historical metadata.

## VPS configuration

Serve the Vite `dist/` folder over HTTPS. The manifest must return JSON, including
on a cache miss; do not rewrite missing release files to the SPA HTML fallback.
For Nginx, add these locations within the website's HTTPS server block:

```nginx
location = /releases/latest.json {
    try_files $uri =404;
    add_header Cache-Control "no-cache" always;
}
location /downloads/ {
    try_files $uri =404;
}
```

Keep the configured document root pointing at the deployed `dist` directory and
include normal MIME types. Avoid redirects for the manifest: the desktop checker
requires a direct HTTPS 200 response. CORS is not required; the native client reads
this endpoint. Standard server access logs may record IP addresses; the app sends
no workspace data or API keys in update checks. Account for download bandwidth
within your VPS plan.

## Installation and update behavior

Updates open the matching installer in the user's browser. The app does not
replace itself, restart, or install anything automatically. Users should back up,
finish work, close Thoock, and run the installer. The existing workspace remains
separate from the app; schema migrations still require upgrade testing.

Current Mac previews use the local code-signing certificate and are not notarized. Older archived releases may be ad hoc signed; each build manifest records its actual signature kind. Windows previews are unsigned.
OS security prompts may appear during installation or after an update. Document
those prompts without asking users to disable antivirus or Gatekeeper globally.
A missing architecture gets an availability message, never another platform's
installer. Startup checks are off by default and quiet when offline.

This custom notification manifest is not a Tauri automatic-updater manifest.
If automatic installation is added later, use separate signed updater artifacts
and a compatible feed; no paid Tauri signing service is required.
