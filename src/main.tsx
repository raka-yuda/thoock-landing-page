import './fonts.css';
import './style.css';
import './features.css';

// The static HTML is already usable. Keep React off the first-paint path and
// attach the interactive layer after the browser has drawn that HTML.
let hydration: Promise<void> | undefined;
const start = () => hydration ??= Promise.all([
  import('./hydrate'),
  /^\/changelog(?:\/|$)/.test(location.pathname)
    ? import('./pages/ChangelogPage')
    : import('./pages/HomePage'),
]).then(([module, { default: Page }]) => module.hydrate(Page));
const warm = () => { void start(); };

// A quick first click must still work if it beats the interactive download.
const earlyClick = (event: MouseEvent) => {
  const button = event.target instanceof Element ? event.target.closest('button') : null;
  if (!button || button.disabled || document.getElementById('root')?.dataset.hydrated === 'true') return;
  event.preventDefault();
  event.stopImmediatePropagation();
  void start().then(() => requestAnimationFrame(() => { if (button.isConnected) button.click(); }));
};
document.addEventListener('click', earlyClick, true);
document.addEventListener('pointerdown', warm, { once: true, passive: true });
document.addEventListener('keydown', warm, { once: true });
requestAnimationFrame(() => {
  if ('requestIdleCallback' in window) window.requestIdleCallback(warm, { timeout: 1000 });
  else setTimeout(warm, 0);
});
// Background tabs may not receive animation frames.
const fallback = setTimeout(warm, 1500);
const cleanup = () => {
  clearTimeout(fallback);
  document.removeEventListener('click', earlyClick, true);
  document.removeEventListener('pointerdown', warm);
  document.removeEventListener('keydown', warm);
};
// Cleanup follows readiness even when an interaction started hydration first.
const ready = new MutationObserver(() => {
  if (document.getElementById('root')?.dataset.hydrated === 'true') { cleanup(); ready.disconnect(); }
});
ready.observe(document.getElementById('root')!, { attributes: true, attributeFilter: ['data-hydrated'] });
