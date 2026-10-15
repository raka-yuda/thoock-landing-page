import { useSyncExternalStore } from 'react';

const storageKey = 'thoock-appearance';
const changeEvent = 'thoock:appearance-change';

function getSnapshot() {
  const override = document.documentElement.dataset.theme;
  return override === 'dark' || (override !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
}

function subscribe(onChange: () => void) {
  const media = matchMedia('(prefers-color-scheme: dark)');
  const onStorage = (event: StorageEvent) => {
    if (event.storageArea !== localStorage || (event.key !== null && event.key !== storageKey)) return;
    if (event.newValue === 'dark' || event.newValue === 'light') {
      document.documentElement.dataset.theme = event.newValue;
    } else {
      delete document.documentElement.dataset.theme;
    }
    onChange();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(changeEvent, onChange);
  media.addEventListener('change', onChange);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(changeEvent, onChange);
    media.removeEventListener('change', onChange);
  };
}

function toggleAppearance() {
  const next = getSnapshot() ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem(storageKey, next); } catch { /* Keep the session choice when storage is unavailable. */ }
  window.dispatchEvent(new Event(changeEvent));
}

// The static HTML always renders the light-mode button. React adopts the
// browser preference after hydration without mismatching the server markup.
const getServerSnapshot = () => false;

export function useAppearance() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { dark, toggleAppearance };
}
