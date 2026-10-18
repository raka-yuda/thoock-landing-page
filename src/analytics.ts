import type { Release } from './releases';

// Umami's native click attributes work on prerendered links before React hydrates.
// Count installer clicks, with one event name and filterable release properties.
export function downloadAnalytics(release: Release, source: 'hero' | 'downloads' | 'changelog', url = release.url) {
  const file = url.split('/').pop()!;
  const format = file.split('.').pop()!.toUpperCase();
  const title = `Thoock v${release.version} — ${release.platform} · ${release.architecture} · ${format}`;
  return {
    title,
    'data-umami-event': 'desktop-download',
    'data-umami-event-title': title,
    'data-umami-event-platform': release.platform,
    'data-umami-event-architecture': release.architecture,
    'data-umami-event-version': release.version,
    'data-umami-event-format': format,
    'data-umami-event-source': source,
    'data-umami-event-file': file,
  };
}
