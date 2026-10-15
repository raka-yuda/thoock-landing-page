import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import HomePage from './pages/HomePage';
import ChangelogPage from './pages/ChangelogPage';

// Used by the static build and the Vite development middleware. No production
// server is needed: React only hydrates this same markup in the browser.
export function renderPage(pathname: string) {
  const Page = /^\/changelog(?:\/|$)/.test(pathname) ? ChangelogPage : HomePage;
  return renderToString(<StrictMode><App pathname={pathname}><Page /></App></StrictMode>);
}
