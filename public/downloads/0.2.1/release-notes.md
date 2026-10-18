Thoock 0.2.1 — Windows background-removal download fix

Both macOS (Apple silicon) and Windows (x64) installers use version 0.2.1. The user-facing fix addresses Windows background-removal downloads; macOS was rebuilt to keep the release versions aligned.

- Fix the Windows free-space check for existing destination files. The model runtime download creates a temporary archive before checking disk space; the check now queries the containing folder as required by Windows.
- This resolves the generic file-operation error when installation moves from the model download to the ONNX runtime download, and protects other operations that check space for existing files.
- Report a specific disk-space-check error with the Windows system error number if the destination folder cannot be queried.
- Add regression coverage for existing temporary archive paths and the native free-space preflight. The native suite passed on macOS ARM64 (76 passed, 2 optional tests skipped). The full Windows installation flow still needs verification on Windows.

Close Thoock and install 0.2.1 over the previous version, then retry the model download from Settings → Image tools. A successfully downloaded and verified model file is retained and reused. Your workspace, keys, and preferences remain separate from the installer.

Apple silicon macOS and Windows x64 preview installers. macOS is ad hoc signed and not notarized; Windows is unsigned. Background removal requires macOS 13.3 or later. Older installers remain archived; returning to an older installer does not roll back workspace data.
