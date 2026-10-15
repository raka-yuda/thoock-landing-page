import { StrictMode, useEffect } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';

export function hydrate() {
  return new Promise<void>(resolve => {
    const root = document.getElementById('root')!;
    function Ready() {
      useEffect(() => {
        root.dataset.hydrated = 'true';
        resolve();
      }, []);
      return null;
    }
    const app = <StrictMode><App /><Ready /></StrictMode>;
    if (root.hasChildNodes()) hydrateRoot(root, app);
    else createRoot(root).render(app);
  });
}
