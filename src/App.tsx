import { useEffect } from 'react';
import type { ReactNode } from 'react';
import ArrowUpRightIcon from 'lucide-react/dist/esm/icons/arrow-up-right.mjs';
import DownloadSimpleIcon from 'lucide-react/dist/esm/icons/download.mjs';
import MoonIcon from 'lucide-react/dist/esm/icons/moon.mjs';
import SunIcon from 'lucide-react/dist/esm/icons/sun.mjs';
import { useEntranceMotion } from './useEntranceMotion';
import { useAppearance } from './useAppearance';

function Brand({ small = false }: { small?: boolean }) {
  return <a href="/#top" className={`brand ${small ? 'brand-small' : ''}`} aria-label="Thoock home"><img src="/thoock-icon.svg" width="38" height="38" alt="" /><span>Thoock</span></a>;
}

function ThemeToggle() {
  const { dark, toggleAppearance } = useAppearance();
  return <button className="icon-button theme-toggle" onClick={toggleAppearance} aria-label={`Switch to ${dark ? 'light' : 'dark'} appearance`}>{dark ? <SunIcon size={19} /> : <MoonIcon size={19} />}</button>;
}

function Header({ changelogPage = false }: { changelogPage?: boolean }) {
  return <header className="header"><div className="header-inner"><Brand /><nav aria-label="Main navigation"><a href="/#workflow">Workflow</a><a href="/#workspace">Your workspace</a><a href="/changelog/" aria-current={changelogPage ? 'page' : undefined}>Changelog</a><a href="/#faq">FAQ</a></nav><div className="header-actions"><ThemeToggle /><a className="button primary nav-download" href="/#download"><DownloadSimpleIcon size={17} /><span>Download Thoock</span></a></div></div></header>;
}

function Footer() {
  return <footer className="footer container"><div className="footer-top"><Brand small /><p>A desktop workspace for stock-image creators.</p><a href="/changelog/" className="text-link footer-changelog">Changelog <ArrowUpRightIcon size={15} /></a><a href="#top" className="text-link">Back to top <ArrowUpRightIcon size={15} /></a></div><div className="footer-bottom"><span>Made for the work between an idea and an image.</span><span>Independent of Adobe. Built for your workflow.</span></div></footer>;
}
export default function App({ pathname, children, onHydrated }: { pathname?: string; children: ReactNode; onHydrated?: () => void }) {
  const path = pathname ?? (typeof window === 'undefined' ? '/' : window.location.pathname);
  const changelogPage = /^\/changelog(?:\/|$)/.test(path);
  useEntranceMotion();
  useEffect(() => { onHydrated?.(); }, [onHydrated]);
  useEffect(() => {
    if (changelogPage) {
      document.title = 'Changelog | Thoock';
      document.querySelector('meta[name="description"]')?.setAttribute('content', 'The latest Thoock Desktop updates, new features, and improvements. Read what changed in each version.');
    } else {
      const redirectLegacyLink = () => {
        if (window.location.hash === '#changelog') window.location.replace('/changelog/');
      };
      redirectLegacyLink();
      window.addEventListener('hashchange', redirectLegacyLink);
      return () => window.removeEventListener('hashchange', redirectLegacyLink);
    }
  }, [changelogPage]);
  return <><a className="skip-link" href="#main">Skip to content</a><div id="top" /><Header changelogPage={changelogPage} />{children}<Footer /></>;
}
