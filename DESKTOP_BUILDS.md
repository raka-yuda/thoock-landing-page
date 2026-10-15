# Desktop downloads — 0.1.0

Built on 15 October 2026 from the current desktop working tree, including the uncommitted responsive selection-bar changes. No source commit or push was made for these builds.

## Files and serving

The artifacts live in `public/downloads/`. Vite copies this folder to `dist/downloads/` when the landing-page project is built. Serve the landing-page `dist/` directory; the download paths are:

- `/downloads/Thoock_0.1.0_macos_arm64.dmg` — macOS installer disk image, Apple Silicon.
- `/downloads/Thoock_0.1.0_macos_arm64.zip` — the same macOS app bundle in a ZIP archive.
- `/downloads/Thoock_0.1.0_windows_x64_setup.exe` — Windows x64 NSIS installer.
- `/downloads/SHA256SUMS.txt` — SHA-256 checksums.
- `/downloads/build-manifest.json` — sizes, hashes, architectures, and build verification details.

The existing landing-page download-button configuration in `src/releases.ts` is unchanged. These files can be linked directly using the paths above. The entries should describe these as unsigned preview downloads until platform testing and distribution signing are complete.

## Signing and verification

- macOS: release build for ARM64, with a minimum executable deployment target of macOS 11.0. The bundle is ad hoc signed; it is **not Developer ID signed or notarized**. Its signature and the DMG/ZIP integrity were checked. Downloaded copies may be blocked by Gatekeeper; an ad hoc signature does not provide public distribution trust. Intel Macs are not supported by this artifact.
- Windows: release build cross-compiled for `x86_64-pc-windows-msvc`, packaged with NSIS. The installer is **not Authenticode signed** and has **not been installed or run on a Windows machine**. SmartScreen may warn about the unknown publisher. Microsoft Edge WebView2 is required; the installer can download it when absent, so that setup needs internet access.
- Frontend build and all seven UI unit tests passed. Compile/package checks are not a substitute for testing installation and the native workflows on each supported operating system.
- The build inputs are source files and generated frontend assets. Local workspaces, runtime databases, logs, credentials, and screenshot references are not packaged as resources.

## Build commands

macOS (native Apple Silicon):

```sh
npm run tauri -- build --bundles app,dmg --config src-tauri/tauri.macos.dev.conf.json
```

Windows cross-compilation from this Mac uses Rust's `x86_64-pc-windows-msvc` target, `cargo-xwin`, LLVM/LLD, and NSIS:

```sh
npm run tauri -- build --runner cargo-xwin --target x86_64-pc-windows-msvc --bundles nsis
```

The cross-compilation tools used for this build are in `/private/tmp/thoock-cross-tools`, and the downloaded Windows SDK cache is in `/private/tmp/thoock-windows-sdk`. Those are temporary machine-local build tools, not installer contents. The base desktop source remains in the sibling `thoock-desktop-app` project.
