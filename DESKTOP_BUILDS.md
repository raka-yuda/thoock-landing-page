# Desktop downloads

The current release and every retained version are listed in
`public/releases/index.json`. The homepage and desktop checker use
`public/releases/latest.json`; the changelog offers downloads from each immutable
version manifest, such as `public/releases/0.2.0.json`.

Artifacts are grouped under `public/downloads/<version>/`:

- `Thoock_<version>_macos_arm64.dmg` — Apple silicon installer disk image.
- `Thoock_<version>_macos_arm64.zip` — the same app bundle as a ZIP.
- `Thoock_<version>_windows_x64_setup.exe` — Windows x64 NSIS installer.
- `SHA256SUMS.txt`, `build-manifest.json`, and `release-notes.md` — verification and release details.

The original flat v0.1.0 installer URLs remain available. Their bytes are retained
unchanged. Root `build-manifest.json` and `SHA256SUMS.txt` are latest-release aliases;
use versioned paths for historical metadata.

Vite copies all retained versions to `dist/downloads/`. Deploy the whole `dist/`
folder, not just the newest installers, to preserve previous download links.
Building locally does not deploy the site.

## Preview verification

macOS ARM64 previews are ad hoc signed and not Developer ID signed or notarized.
Windows x64 installers are unsigned and Windows installation/runtime testing is
pending. Check each version's build manifest for actual architecture, size,
checksums, source revision, working-tree fingerprint, and verification results.
Those checks do not imply Windows runtime or installed-app upgrade verification.
Local background removal requires macOS 13.3 or later; an Intel Mac installer is
not included. Provider models and ONNX runtime downloads are optional and separate
from the installer. User workspaces and vault keys are not packaged.

See [release operations](docs/DESKTOP_RELEASES.md) for building and staging future
versions. Keep a compatible workspace backup before changing app versions;
installing an older binary does not roll back migrated workspace data.
