export type Release = {
  platform: 'macOS' | 'Windows';
  architecture: string;
  minimumOS: string | null;
  version: string;
  bytes: number;
  url: string;
  alternativeUrl?: string;
  note: string;
  available: boolean;
};
// Matches public/downloads/build-manifest.json. Keep installer filenames stable.
export const releases: Release[] = [
  {
    platform: 'macOS', architecture: 'Apple silicon (ARM64)', minimumOS: null,
    version: '0.1.0', bytes: 5678666,
    url: '/downloads/Thoock_0.1.0_macos_arm64.dmg',
    alternativeUrl: '/downloads/Thoock_0.1.0_macos_arm64.zip',
    note: 'Release preview. Ad hoc signed; not notarized. For Apple silicon Macs.',
    available: true,
  },
  {
    platform: 'Windows', architecture: '64-bit (x64)', minimumOS: null,
    version: '0.1.0', bytes: 4282823,
    url: '/downloads/Thoock_0.1.0_windows_x64_setup.exe',
    note: 'Release preview. Unsigned installer; Windows runtime testing is pending.',
    available: true,
  },
];
export function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
export function preferredRelease() {
  const agent = navigator.userAgent;
  if (/Android|iPhone|iPad|iPod/i.test(agent)) return undefined;
  const platform = /Windows/i.test(agent) ? 'Windows' : /Macintosh/i.test(agent) ? 'macOS' : null;
  return releases.find(release => release.platform === platform && release.available && release.url);
}
