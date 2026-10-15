// Newest first. Dates describe documented product updates, not installer releases.
// Source: thoock-desktop-app/package.json and docs/IMPLEMENTATION_STATUS.md.
export const changelog = [
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
