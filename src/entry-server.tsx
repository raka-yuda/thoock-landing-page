import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import HomePage from './pages/HomePage';
import ChangelogPage from './pages/ChangelogPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

// Used by the static build and the Vite development middleware. No production
// server is needed: React only hydrates this same markup in the browser.
export function renderPage(pathname: string) {
  const Page = /^\/terms(?:\/|$)/.test(pathname) ? TermsPage : /^\/privacy(?:\/|$)/.test(pathname) ? PrivacyPage : /^\/refund-policy(?:\/|$)/.test(pathname) ? RefundPolicyPage : /^\/changelog(?:\/|$)/.test(pathname) ? ChangelogPage : HomePage;
  return renderToString(<StrictMode><App pathname={pathname}><Page /></App></StrictMode>);
}
