import { renderToString } from 'react-dom/server';
import App from './App';

// Used by the static build and the Vite development middleware. No production
// server is needed: React only hydrates this same markup in the browser.
export function renderPage(pathname: string) {
  return renderToString(<App pathname={pathname} />);
}
