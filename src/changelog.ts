// Newest first. Every entry links to its immutable installer release manifest.
// Source: thoock-desktop-app/package.json and docs/IMPLEMENTATION_STATUS.md.
export const changelog = [
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
