import { StrictMode } from 'react';
import type { ComponentType } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';

// The bootstrap fetches the shared runtime and current page concurrently.
export function hydrate(Page: ComponentType) {
  return new Promise<void>(resolve => {
    const root = document.getElementById('root')!;
    const onHydrated = () => {
      root.dataset.hydrated = 'true';
      resolve();
    };
    const app = <StrictMode><App onHydrated={onHydrated}><Page /></App></StrictMode>;
    if (root.hasChildNodes()) hydrateRoot(root, app);
    else createRoot(root).render(app);
  });
}
