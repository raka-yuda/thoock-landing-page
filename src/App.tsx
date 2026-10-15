import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import ArrowDownIcon from 'lucide-react/dist/esm/icons/arrow-down.mjs';
import ArrowDownRightIcon from 'lucide-react/dist/esm/icons/arrow-down-right.mjs';
import ArrowRightIcon from 'lucide-react/dist/esm/icons/arrow-right.mjs';
import ArrowUpRightIcon from 'lucide-react/dist/esm/icons/arrow-up-right.mjs';
import CaretDownIcon from 'lucide-react/dist/esm/icons/chevron-down.mjs';
import CheckIcon from 'lucide-react/dist/esm/icons/check.mjs';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/circle-check.mjs';
import DesktopIcon from 'lucide-react/dist/esm/icons/monitor.mjs';
import DownloadSimpleIcon from 'lucide-react/dist/esm/icons/download.mjs';
import FileCsvIcon from 'lucide-react/dist/esm/icons/file-spreadsheet.mjs';
import FolderSimpleIcon from 'lucide-react/dist/esm/icons/folder.mjs';
import HardDrivesIcon from 'lucide-react/dist/esm/icons/hard-drive.mjs';
import ImageIcon from 'lucide-react/dist/esm/icons/image.mjs';
import KeyIcon from 'lucide-react/dist/esm/icons/key-round.mjs';
import MoonIcon from 'lucide-react/dist/esm/icons/moon.mjs';
import ShieldCheckIcon from 'lucide-react/dist/esm/icons/shield-check.mjs';
import SunIcon from 'lucide-react/dist/esm/icons/sun.mjs';
import WindowsLogoIcon from 'lucide-react/dist/esm/icons/panels-top-left.mjs';
import AppleLogoIcon from 'lucide-react/dist/esm/icons/laptop.mjs';
import { preferredRelease, releases, formatFileSize } from './releases';
import { changelog, latestUpdate, formatUpdateDate } from './changelog';
import { useEntranceMotion } from './useEntranceMotion';
import FeatureShowcase from './FeatureShowcase';

const questions = [
  ['What is Thoock?', 'Thoock is a desktop workspace for stock-image creators. Research topics, write commercial briefs, generate candidates, review images, and prepare Adobe-compatible export packages in one connected workflow.'],
  ['Do I need a Thoock account?', 'No. Thoock Desktop is a single-user workspace that lives on your computer. There is no Thoock sign-in required.'],
  ['Do I need my own API keys?', 'Yes, for provider-backed features. Connect supported services such as OpenAI or Gemini for text and research, and SnapGen for image generation. Provider usage may incur separate charges. Local research and brief tools work without credentials.'],
  ['Does it work offline?', 'Your local workspace tools do. Provider-backed research, image generation, and metadata requests need an internet connection and your configured credentials.'],
  ['Does it upload to Adobe Stock for me?', 'Thoock prepares the files and metadata. You review your package and upload it manually in Adobe Contributor Portal. Adobe decides whether to accept submissions.'],
  ['Where are my files and API keys stored?', 'Your workspace and images are stored locally. API keys are stored in the operating-system credential vault. Provider-backed actions send the relevant prompts or images to the service you configure.'],
  ['Which computers can run Thoock?', 'Release-preview downloads are available for Apple silicon Macs (ARM64) and 64-bit Windows (x64). The macOS build is ad hoc signed and not notarized. The Windows installer is unsigned and Windows runtime testing is pending. An Intel Mac build is not included.'],
];

function Brand({ small = false }: { small?: boolean }) {
  return <a href="/#top" className={`brand ${small ? 'brand-small' : ''}`} aria-label="Thoock home"><img src="/thoock-icon.svg" width="38" height="38" alt="" /><span>Thoock</span></a>;
}
function WindowFrame({ title, children, className = '', trailing }: { title: string; children: ReactNode; className?: string; trailing?: ReactNode }) {
  return <div className={`window ${className}`}><div className="window-title"><span className="window-dots" aria-hidden="true"><i /><i /><i /></span><span>{title}</span><span className="window-trailing">{trailing}</span></div>{children}</div>;
}
function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');
    setDark(document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && media.matches));
    const listener = () => { if (!document.documentElement.dataset.theme) setDark(media.matches); };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    try { localStorage.setItem('thoock-appearance', next ? 'dark' : 'light'); } catch { /* Keep session choice. */ }
  }
  return <button className="icon-button theme-toggle" onClick={toggle} aria-label={`Switch to ${dark ? 'light' : 'dark'} appearance`}>{dark ? <SunIcon size={19} /> : <MoonIcon size={19} />}</button>;
}
function Header({ changelogPage = false }: { changelogPage?: boolean }) {
  return <header className="header"><div className="header-inner"><Brand /><nav aria-label="Main navigation"><a href="/#workflow">Workflow</a><a href="/#workspace">Your workspace</a><a href="/changelog/" aria-current={changelogPage ? 'page' : undefined}>Changelog</a><a href="/#faq">FAQ</a></nav><div className="header-actions"><ThemeToggle /><a className="button primary nav-download" href="/#download"><DownloadSimpleIcon size={17} /><span>Download Thoock</span></a></div></div></header>;
}
function Hero() {
  const [release, setRelease] = useState<ReturnType<typeof preferredRelease>>(undefined);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    setRelease(preferredRelease());
    setMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);
  return <section className="hero" aria-labelledby="hero-title">
    <div className="hero-copy"><div className="app-emblem"><img src="/thoock-icon.svg" alt="" width="76" height="76" /></div>
      <h1 id="hero-title">Your stock-image workflow.<br /> <span>All together.</span></h1>
      <p>Research ideas, write briefs, generate images, and prepare Adobe Stock packages. One desktop workspace, from start to finish.</p>
      <div className="hero-actions"><a className="button primary large" href={release?.url ?? '#download'} download={release ? release.url.split('/').pop() : undefined}><DownloadSimpleIcon size={20} />{release ? `Download for ${release.platform}` : mobile ? 'View desktop downloads' : 'View download options'}</a><a className="text-link" href="#workflow">Explore the workflow <ArrowDownIcon size={16} /></a></div>
      <p className="hero-note">Local workspace. Your own API keys. No Thoock account.<span className="hero-release-info">{release ? `v${release.version} release preview for ${release.architecture}` : `v${latestUpdate.version} release preview for macOS and Windows`}</span></p>
    </div>
    <div className="hero-scene">
      <div className="floating landscape-window" aria-hidden="true"><WindowFrame title="a little inspiration"><img src="/screenshots/landscape.webp" loading="lazy" width="480" height="364" alt="" /></WindowFrame></div>
      <div className="floating brief-window" aria-hidden="true"><WindowFrame title="the idea, in detail"><img src="/screenshots/brief-480.webp" loading="lazy" width="1100" height="941" alt="" /></WindowFrame></div>
      <div className="hero-main-window"><WindowFrame title="Thoock / Review queue" trailing={<span className="window-caption"><ShieldCheckIcon size={13} /> Your local workspace</span>}><img className="hero-screenshot" src="/screenshots/review-queue.webp" srcSet="/screenshots/review-queue-480.webp 480w, /screenshots/review-queue-800.webp 800w, /screenshots/review-queue.webp 1500w" sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 150px), 1090px" width="1500" height="930" fetchPriority="high" alt="Thoock review queue showing image candidates, decisions, technical checks, and metadata status." /></WindowFrame></div>
      <div className="scene-note note-left" aria-hidden="true">less tab-hopping.<ArrowDownRightIcon size={25} /></div>
      <div className="scene-note note-right" aria-hidden="true">more making.<ArrowDownRightIcon size={25} /></div>
    </div>
    <p className="preview-note">A look inside Thoock’s review workflow. Product reference shown.</p>
  </section>;
}
function WorkspaceSection() {
  const benefits = [
    { icon: HardDrivesIcon, title: 'On your computer.', body: 'Your library, briefs, and export history live in a local workspace.' },
    { icon: KeyIcon, title: 'Your providers. Your keys.', body: 'Connect supported services. Credentials stay in your operating-system vault.' },
    { icon: ShieldCheckIcon, title: 'You’re in control.', body: 'Confirm requests before they run. Interrupted attempts are never silently repeated.' },
    { icon: FolderSimpleIcon, title: 'Made to keep.', body: 'Back up, restore, or move your workspace as your library grows.' },
  ];
  return <section className="workspace-section" id="workspace"><div className="container workspace-grid"><div className="workspace-copy"><span className="section-kicker"><DesktopIcon size={17} /> A desktop app, through and through</span><h2>Your workspace<br /> stays with you.</h2><p className="section-intro">A little less cloud. A little more yours.<br /> Keep the work close and the process organized.</p><div className="benefits">{benefits.map(item => <div className="benefit" key={item.title}><span className="material-icon"><item.icon size={21} /></span><div><h3>{item.title}</h3><p>{item.body}</p></div></div>)}</div><p className="provider-note">Provider-backed actions send relevant prompts or images to your configured service. Provider usage is billed separately.</p></div><div className="workspace-art"><div className="workspace-icon-tray" aria-hidden="true"><span><FolderSimpleIcon size={42} /></span><span className="tray-main"><img src="/thoock-icon.svg" width="90" height="90" alt="" /></span><span><ImageIcon size={42} /></span></div><WindowFrame title="Thoock / Your workspace"><img src="/screenshots/workspace.webp" srcSet="/screenshots/workspace-480.webp 480w, /screenshots/workspace-800.webp 800w, /screenshots/workspace.webp 1200w" sizes="(max-width: 767px) calc(100vw - 40px), 550px" alt="Thoock desktop settings with workspace and provider configuration using demo data." width="1160" height="850" loading="lazy" /></WindowFrame><div className="local-footnote"><ShieldCheckIcon size={16} /><span>Local files. OS-protected keys. Your workspace.</span></div></div></div></section>;
}
function DownloadPanel() {
  return <section className="section container download-section" id="download" aria-labelledby="download-title"><div className="download-panel"><div className="download-copy"><div className="download-emblem"><img src="/thoock-icon.svg" width="72" height="72" alt="" /></div><h2 id="download-title">Make room for<br /> your next batch.</h2><p>Bring your stock-image production<br className="desktop-break" /> into one desktop workspace.</p><span className="download-detail"><CheckIcon size={15} /> No Thoock account needed</span><a className="latest-update-link" href="/changelog/">Latest update: v{latestUpdate.version}<span>Updated {formatUpdateDate(latestUpdate.date)} <ArrowUpRightIcon size={12} /></span></a></div><div className="platforms">{releases.map(release => {
    const Logo = release.platform === 'macOS' ? AppleLogoIcon : WindowsLogoIcon;
    return <div className="platform" key={release.platform}><span className="platform-logo"><Logo size={27} /></span><div className="platform-info"><h3>Thoock for {release.platform}</h3><p>{release.architecture} / v{release.version} / {formatFileSize(release.bytes)}</p></div>
      {release.available ? <a className="button primary platform-download" href={release.url} download={release.url.split('/').pop()}><DownloadSimpleIcon size={16} />Download for {release.platform}</a> : <span className="unavailable">Download not available yet</span>}
      <p className="platform-release-note">{release.note}</p>
      {release.alternativeUrl && <a className="alternative-download" href={release.alternativeUrl} download={release.alternativeUrl.split('/').pop()}>Download ZIP instead <ArrowDownIcon size={12} /></a>}
    </div>;
  })}<a className="checksums-link" href="/downloads/SHA256SUMS.txt">View SHA-256 checksums <ArrowUpRightIcon size={12} /></a><p className="cost-note"><KeyIcon size={14} /> Bring your own API keys. Provider usage may incur charges.</p></div></div></section>;
}
function FAQ() {
  return <section className="section faq-section container" id="faq"><div className="faq-heading"><span className="section-kicker">A few things to know</span><h2>Good questions.<br /> Straight answers.</h2><p>A little context before you<br className="desktop-break" /> make yourself at home.</p></div><div className="faq-items">{questions.map(([question, answer]) => <details key={question}><summary>{question}<span className="faq-caret"><CaretDownIcon size={17} /></span></summary><p>{answer}</p></details>)}</div></section>;
}
function Footer() {
  return <footer className="footer container"><div className="footer-top"><Brand small /><p>A desktop workspace for stock-image creators.</p><a href="/changelog/" className="text-link footer-changelog">Changelog <ArrowUpRightIcon size={15} /></a><a href="#top" className="text-link">Back to top <ArrowUpRightIcon size={15} /></a></div><div className="footer-bottom"><span>Made for the work between an idea and an image.</span><span>Independent of Adobe. Built for your workflow.</span></div></footer>;
}
function ChangelogPage() {
  return <main id="main" className="changelog-page">
    <header className="changelog-page-heading container">
      <a href="/" className="text-link changelog-back"><ArrowRightIcon size={14} /> Back to Thoock</a>
      <span className="section-kicker">Changelog</span>
      <h1>What’s new.</h1>
      <p>New features, thoughtful improvements, and the details in between.</p>
    </header>
    <div className="release-history container">{changelog.map((entry, index) => <article className="release-entry" key={entry.version} id={`v${entry.version}`} aria-labelledby={`release-${entry.version}`}>
      <aside className="release-meta"><a href={`#v${entry.version}`} className="release-version" aria-label={`Link to version ${entry.version}`}>v{entry.version}</a><time dateTime={entry.date}>{formatUpdateDate(entry.date)}</time>{index === 0 && <span className="latest-badge">Latest update</span>}</aside>
      <div className="release-content"><h2 id={`release-${entry.version}`}>{entry.title}</h2><p className="release-summary">{entry.summary}</p>
        <figure className="release-figure"><WindowFrame title="Thoock / Review queue"><img src="/screenshots/review.webp" width="1200" height="900" alt="Thoock desktop review queue with illustrated demo assets and quality-review controls." /></WindowFrame><figcaption>The desktop review workspace, shown with illustrated demo assets.</figcaption></figure>
        <div className="release-highlights">{entry.highlights.map(item => <section key={item.label}><h3>{item.label}</h3><p>{item.text}</p></section>)}</div>
        <section className="release-improvements"><h3>Also in this update</h3><ul>{entry.details.map(detail => <li key={detail}>{detail}</li>)}</ul></section>
        <div className="release-availability"><span className="build-label">{entry.status}</span><p>{entry.availability}</p><a href="/#download" className="text-link">View download options <ArrowRightIcon size={14} /></a></div>
      </div>
    </article>)}</div>
    <div className="changelog-end container"><CheckCircleIcon size={18} /><p>You’re all caught up.</p><a href="/#download" className="text-link">Back to downloads <ArrowRightIcon size={14} /></a></div>
  </main>;
}
export default function App({ pathname }: { pathname?: string } = {}) {
  const path = pathname ?? (typeof window === 'undefined' ? '/' : window.location.pathname);
  const changelogPage = /^\/changelog(?:\/|$)/.test(path);
  useEntranceMotion();
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
  return <><a className="skip-link" href="#main">Skip to content</a><div id="top" /><Header changelogPage={changelogPage} />{changelogPage ? <ChangelogPage /> : <main id="main"><Hero /><div className="workflow-bridge container"><span className="bridge-icon"><FileCsvIcon size={23} /></span><p>Good images start before the prompt.<br /> <strong>And the work doesn’t end at generate.</strong></p><span className="bridge-line" /><span className="bridge-end"><CheckCircleIcon size={19} /> That’s where Thoock comes in.</span></div><FeatureShowcase /><WorkspaceSection /><DownloadPanel /><FAQ /></main>}<Footer /></>;
}
