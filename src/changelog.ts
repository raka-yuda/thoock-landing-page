// Newest first. Every entry links to its immutable installer release manifest.
// Source: thoock-desktop-app/package.json and docs/IMPLEMENTATION_STATUS.md.
export const changelog = [
  {
    version: '0.4.0',
    date: '2026-10-23',
    status: 'Beta',
    title: 'Sharper images, simpler local tools.',
    summary: 'Upscale images locally, manage optional models with clear progress, and finish review downloads and briefs with fewer detours.',
    highlights: [
      { label: 'Upscale on device', text: 'Use optional 2× or 4× Real-ESRGAN enlargement from Image tools while preserving transparency and the original image.' },
      { label: 'Manage local models', text: 'Download background-removal and upscaling models with measured progress, cancellation, retry-safe caching, and offline processing.' },
      { label: 'Finish review faster', text: 'Open the saved image folder from the success notification and choose manual or AI-assisted brief creation from an opportunity.' },
    ],
    details: [
      'Original files remain immutable while processed previews require explicit confirmation before application.',
      'Model downloads use pinned HTTPS artifacts, SHA-256 verification, bounded paths, atomic persistence, and retained license notices.',
      'Review download receipts open the destination folder without adding another footer control to the review dialog.',
      'The release keeps the existing provider, metadata, export, backup, and workspace workflows intact.',
      'Windows installer execution, local inference, and upgrade behavior still require verification on a real Windows desktop.',
    ],
    availability: 'Close Thoock and install over your previous version. macOS is signed with a local certificate and is not notarized; Windows is unsigned. Both installers use 0.4.0, and updates remain browser downloads followed by manual installation.',
  },
  {
    version: '0.3.0',
    date: '2026-10-21',
    status: 'Beta',
    title: 'Photos, footage, and more ways to finish your metadata.',
    summary: 'Review video alongside images, prepare Shutterstock submissions, and choose Anthropic Claude or OpenRouter for AI-assisted research and metadata.',
    highlights: [
      { label: 'Review your footage', text: 'Import or drop video batches, browse a four-column library, inspect playback and sampled frames, and prepare AI metadata with explicit confirmation.' },
      { label: 'Prepare once', text: 'General metadata and separate Adobe Stock and Shutterstock categories now live in Review queue. Export sections focus on ready files and agency CSVs.' },
      { label: 'Choose your AI provider', text: 'Anthropic Claude and OpenRouter join OpenAI and Google Gemini for research, briefs, photo/editorial metadata, and sampled-frame video metadata.' },
    ],
    details: [
      'Videos stay in their original folders. Only selected analysis frames, timestamps, and supplied context are sent for AI metadata; full footage and audio stay on the device. Video originals need their own backup.',
      'Use embedded capture-date and location hints to assist real-photo editorial captions. Confirm the facts yourself; GPS coordinates are not automatically treated as a verified city.',
      'Export reviewed original images and Shutterstock CSVs, or video metadata CSVs using original filenames. Upload the original footage yourself. Shutterstock does not accept AI-generated contributor images.',
      'Use separate General, Adobe Stock, and Shutterstock metadata sections, with optional Shutterstock text overrides. Adobe image packages now contain upload images and metadata CSV without extra reports.',
      'Confirm bulk human review, open the saved export folder, and use clearer readiness indicators, compact cards, selection controls, tooltips, and navigation.',
      'Provider keys remain in the operating-system vault with a zeroizing backend cache and idle expiry. Paid requests require confirmation and are not automatically retried. OpenRouter routing requests no training-data collection and disables fallback hosts.',
      'Bundle locally built FFmpeg tools with matching source and license notices. Explicit D3D11 support corrects the Windows Media Foundation build; CI retains compiler and browser diagnostics.',
      'Update TLS/ZIP dependencies and preserve older versioned installers. New provider transports are covered by mocked tests; live paid-model quality and installed Windows behavior still require device testing.',
    ],
    availability: 'Back up before upgrading: this release adds video records and a workspace schema migration. Apple silicon macOS is signed with a local certificate and is not notarized; Windows is unsigned. Both installers use 0.3.0. Updates remain browser downloads followed by manual installation; older installers do not roll back workspace data.',
  },
  {
    version: '0.2.3',
    date: '2026-10-19',
    status: 'Beta',
    title: 'Your workspace, from the moment you open Thoock.',
    summary: 'The demo workspace is removed, and a clear Beta badge identifies releases below version 1.0.0.',
    highlights: [
      { label: 'Open your own workspace', text: 'The Demo data switch, sample workspace, and demo-only status labels are removed. Previously saved demo preferences no longer change which workspace opens.' },
      { label: 'Know the release stage', text: 'A Beta badge appears beside version information in the app and on the website while the major version is zero.' },
      { label: 'Keep your work', text: 'Existing workspace files, provider keys, preferences, and downloaded models stay on the device; no reset is needed.' },
    ],
    details: [
      'Synthetic records and illustrations are used only by automated tests and no longer ship with the application.',
      'Numeric versions and update ordering are unchanged; the Beta badge disappears at major version 1 and above.',
      'Both macOS Apple silicon and Windows x64 installers use v0.2.3.',
      'The background-removal download corrections from 0.2.1 and 0.2.2 are included; end-to-end Windows runtime verification remains pending.',
    ],
    availability: 'Close Thoock and install over your previous version. macOS is ad hoc signed and not notarized; Windows is unsigned. Older installers remain available, and update checks still use browser downloads with manual installation.',
  },
  {
    version: '0.2.2',
    date: '2026-10-18',
    status: 'Release preview',
    title: 'A safer finish for runtime downloads.',
    summary: 'Address a second Windows background-removal setup failure when saving the runtime after the download finishes.',
    highlights: [
      { label: 'Avoid the file conflict', text: 'Runtime downloads now save to a fresh path instead of replacing a temporary archive that setup still holds open.' },
      { label: 'Retry without starting over', text: 'Already verified model files stay available, and failed runtime staging files are cleaned up.' },
      { label: 'Useful error details', text: 'Save failures include the system error number and error kind without exposing private file paths.' },
    ],
    details: [
      'Size and SHA-256 verification still run before runtime extraction.',
      'Regression checks cover the runtime destination contract, actual verified saving, download failures, cleanup, and safe error diagnostics.',
      'Both macOS and Windows installers use v0.2.2; macOS was rebuilt to keep platform versions aligned.',
      'The Windows download and installation flow still needs verification on Windows; host regression tests do not establish end-to-end Windows success.',
    ],
    availability: 'Close Thoock, install this preview over the previous version, then retry setup in Settings → Image tools. A valid model download can be reused. If saving still fails, report the error kind and system error number.',
  },
  {
    version: '0.2.1',
    date: '2026-10-18',
    status: 'Release preview',
    title: 'A fix for Windows model downloads.',
    summary: 'Correct the disk-space check that could stop background-removal setup while moving from the model download to its runtime download.',
    highlights: [
      { label: 'Download the runtime', text: 'Windows now checks free space using the destination folder instead of the existing temporary archive file.' },
      { label: 'Keep your download', text: 'Successfully downloaded model files are verified and reused when you retry setup after updating.' },
      { label: 'Clearer failure details', text: 'If the destination folder cannot be queried, the error identifies the disk-space check and includes the Windows system error number.' },
    ],
    details: [
      'Regression coverage reproduces the original generic file-operation error and checks existing archive destinations.',
      'The correction also applies to other operations that check space for an existing destination file.',
      'Low-space reserves and download integrity checks remain in place.',
      'Both macOS and Windows installers use v0.2.1. The download fix affects Windows; macOS was rebuilt to keep platform versions aligned.',
    ],
    availability: 'Close Thoock, install this preview over the previous version, then retry setup in Settings → Image tools. Workspace data and valid model downloads stay on the device. Windows installation and runtime verification remain pending.',
  },
  {
    version: '0.2.0',
    date: '2026-10-18',
    status: 'Release preview',
    title: 'More room to create. More control over your workspace.',
    summary: 'Transparent cutouts, recoverable deletion, a clearer dashboard, and better tools for keeping a growing image library under control.',
    highlights: [
      { label: 'Manage your space', text: 'Move work to recoverable Trash, inspect storage usage, clean up disposable files, and start fresh without reinstalling.' },
      { label: 'Make transparent cutouts', text: 'Download the optional local background-removal model, inspect a cutout preview, and export genuine transparent PNGs while preserving originals.' },
      { label: 'Find your next step', text: 'A task-focused dashboard, optional setup guide, searchable selectors, and organized settings keep everyday work close at hand.' },
    ],
    details: [
      'Backup, restore, and reset now show processing progress and support cancellation.',
      'Provider keys reconnect from this device’s credential vault after recovery; backups never contain key values.',
      'About & updates offers optional release checks and manual browser downloads.',
      'Provider-log pagination, cached storage measurements, disk-space checks, and startup recovery improve reliability.',
      'Generated 4K media benchmarks verified backup and fresh-workspace restore with over 10 GiB of originals on Apple silicon macOS; this is not a Windows performance claim.',
    ],
    availability: 'Apple silicon macOS and Windows x64 preview downloads. macOS is ad hoc signed and not notarized; Windows is unsigned and runtime testing is pending. Background removal requires macOS 13.3 or later. Save a backup before updating; older installers do not roll back workspace data.',
  },
  {
    version: '0.1.0',
    date: '2026-10-14',
    status: 'Release preview',
    title: 'The whole workflow, now on your desktop.',
    summary: 'A local workspace that connects your research, commercial briefs, image generation, review, and Adobe-compatible export packages.',
    highlights: [
      { label: 'Create', text: 'Research opportunities, import CSVs, and turn ideas into editable commercial briefs.' },
      { label: 'Produce', text: 'Generate with your own provider keys, track attempts, and explicitly recover interrupted work.' },
      { label: 'Deliver', text: 'Review quality, refine metadata, and export approved JPEGs with Adobe CSV and supporting reports.' },
    ],
    details: [
      'Light, dark, and system appearance, with shared tactile controls throughout the app.',
      'Local backups, restore, workspace relocation, and migration previews.',
      'Operating-system credential storage and redacted provider logs.',
      'Keyboard-friendly calendars, sortable tables, and selection across pages.',
    ],
    availability: 'Download the v0.1.0 release preview for Apple silicon Macs (ARM64) or Windows x64. The macOS build is ad hoc signed and not notarized; the Windows installer is unsigned and runtime testing is pending.',
  },
];
export const latestUpdate = changelog[0];
export function formatUpdateDate(date: string) {
  return new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
}
