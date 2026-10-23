Thoock 0.4.0 — local image tools and smoother review workflows

A shared Beta release for Apple silicon macOS and Windows x64. Save a workspace backup before updating; the installer leaves workspace data, provider keys, preferences, and downloaded models in place.

Create and review
- Add optional local image upscaling with Real-ESRGAN at 2× or 4×. Processing stays on this device after the model download, preserves transparency, and requires explicit review before applying the result.
- Manage background-removal and upscaling models together in Settings → Image tools with measured downloads, cancellation, retry-safe caching, and retained license notices.
- Download reviewed images and open the destination folder directly from the save notification. Existing files are replaced safely after confirmation by the native save dialog.
- Add a brief from an opportunity by choosing manual entry or AI-assisted creation first; the selected opportunity remains connected to either flow.

Reliability and security
- Local model files and shared runtimes use pinned HTTPS hosts, SHA-256 verification, bounded paths, atomic persistence, and cancellation checks.
- Image processing keeps originals immutable and preserves alpha through previews and exports. Human review and metadata checks remain required before approval.
- Toast actions remain usable above review dialogs, and local model progress uses the shared centered operation UI.

Installation
Close Thoock and install 0.4.0 over the previous version. macOS is signed with the local release certificate and is not notarized; Windows is unsigned. Updates remain browser downloads followed by manual installation. Older installers remain archived.

Verification limits
Automated native, unit, and browser tests cover the model lifecycle, image bounds, cancellation, downloads, save receipts, and brief creation flow. Windows installer execution, runtime inference, and upgrade behavior still require verification on a real Windows desktop.
