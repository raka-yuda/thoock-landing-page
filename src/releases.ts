import { latest, history } from 'virtual:thoock-releases';
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
type ReleaseManifest = {
  schemaVersion: number;
  version: string;
  notes: string;
  notesUrl: string;
  downloads: Record<string, Omit<Release, 'minimumOS' | 'version' | 'available'>>;
};
const manifest = latest as ReleaseManifest;
function downloads(release: ReleaseManifest): Release[] {
  return Object.values(release.downloads).map(download => ({
    ...download, version: release.version, minimumOS: null, available: true,
  }));
}
// Latest is shared with the desktop checker; archived manifests keep old links stable.
export const releases = downloads(manifest as ReleaseManifest);
export const releaseHistory = (history as ReleaseManifest[]).map(release => ({
  version: release.version, downloads: downloads(release), checksumsUrl: `/downloads/${release.version}/SHA256SUMS.txt`,
}));
export const checksumsUrl = `/downloads/${manifest.version}/SHA256SUMS.txt`;
export function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
export function preferredRelease() {
  const agent = navigator.userAgent;
  if (/Android|iPhone|iPad|iPod/i.test(agent)) return undefined;
  const platform = /Windows/i.test(agent) ? 'Windows' : /Macintosh/i.test(agent) ? 'macOS' : null;
  return releases.find(release => release.platform === platform && release.available && release.url);
}
