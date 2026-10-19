import { downloadAnalytics } from '../analytics';
import { useEffect, useState } from 'react';
import ArrowDownIcon from 'lucide-react/dist/esm/icons/arrow-down.mjs';
import ArrowDownRightIcon from 'lucide-react/dist/esm/icons/arrow-down-right.mjs';
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
import ShieldCheckIcon from 'lucide-react/dist/esm/icons/shield-check.mjs';
import WindowsLogoIcon from 'lucide-react/dist/esm/icons/panels-top-left.mjs';
import AppleLogoIcon from 'lucide-react/dist/esm/icons/laptop.mjs';
import { preferredRelease, releases, formatFileSize, checksumsUrl } from '../releases';
import { latestUpdate, formatUpdateDate } from '../changelog';
import FeatureShowcase from '../FeatureShowcase';

const questions = [
  ['What is Thoock?', 'Thoock is a desktop workspace for stock-image creators. Research topics, write commercial briefs, generate candidates, review images, and prepare Adobe-compatible export packages in one connected workflow.'],
  ['Do I need a Thoock account?', 'No. Thoock Desktop is a single-user workspace that lives on your computer. There is no Thoock sign-in required.'],
  ['Do I need my own API keys?', 'Yes, for provider-backed features. Connect supported services such as OpenAI or Gemini for text and research, and SnapGen for image generation. Provider usage may incur separate charges. Local research and brief tools work without credentials.'],
  ['Can I use images I already have?', 'Yes. Import JPEG, PNG, or WebP images into the review workflow. You can review their quality, edit metadata, and prepare approved files for export without generating new images.'],
  ['Does it work offline?', 'Your local workspace tools do. Provider-backed research, image generation, and metadata requests need an internet connection and your configured credentials.'],
  ['Does it upload to Adobe Stock for me?', 'Thoock prepares the files and metadata. You review your package and upload it manually in Adobe Contributor Portal. Adobe decides whether to accept submissions.'],
  ['Where are my files and API keys stored?', 'Your workspace and images are stored locally. API keys are stored in the operating-system credential vault. Provider-backed actions send the relevant prompts or images to the service you configure.'],
  ['How do I install or update Thoock?', 'Download the installer for your computer. On macOS, drag Thoock into Applications. Because this preview is not notarized, macOS may require you to allow it in System Settings → Privacy & Security. Windows may show an unknown-publisher or SmartScreen warning. Only proceed if you trust this download; managed computers may block it. To update, back up your workspace, close Thoock, and install the newer version. Your workspace is stored separately from the app.'],
  ['Which computers can run Thoock?', 'Release-preview downloads are available for Apple silicon Macs (ARM64) and 64-bit Windows (x64). The macOS build is ad hoc signed and not notarized. The Windows installer is unsigned and Windows runtime testing is pending. An Intel Mac build is not included.'],
];


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
      <p>Research the opportunity. Shape the brief. Generate or import images, review the results, and prepare an Adobe Stock package.</p>
      <div className="hero-actions"><a className="button primary large" {...(release ? downloadAnalytics(release, 'hero') : {})} href={release?.url ?? '#download'} download={release ? release.url.split('/').pop() : undefined}><DownloadSimpleIcon size={20} />{release ? `Download for ${release.platform}` : mobile ? 'View desktop downloads' : 'View download options'}</a><a className="text-link" href="#workflow">Explore the workflow <ArrowDownIcon size={16} /></a></div>
      <p className="hero-note">Local workspace. Your own API keys. No Thoock account.<span className="hero-release-info">v{release?.version ?? latestUpdate.version} {release ? `for ${release.architecture}` : 'for macOS and Windows'}</span></p>
    </div>
    <div className="hero-scene">
      <div className="floating landscape-window" aria-hidden="true"><img src="/screenshots/dashboard-480.webp" loading="lazy" width="1200" height="829" alt="" /></div>
      <div className="floating brief-window" aria-hidden="true"><img src="/screenshots/brief-480.webp" loading="lazy" width="1100" height="760" alt="" /></div>
      <div className="hero-main-window"><img className="hero-screenshot" src="/screenshots/review-queue.webp" srcSet="/screenshots/review-queue-480.webp 480w, /screenshots/review-queue-800.webp 800w, /screenshots/review-queue.webp 1500w" sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 150px), 1090px" width="1500" height="1036" fetchPriority="high" alt="Thoock review queue showing image candidates, decisions, technical checks, and metadata status." /></div>
      <div className="scene-note note-left" aria-hidden="true">less tab-hopping.<ArrowDownRightIcon size={25} /></div>
      <div className="scene-note note-right" aria-hidden="true">more making.<ArrowDownRightIcon size={25} /></div>
    </div>
    <p className="preview-note">A look inside Thoock Desktop’s current review workflow.</p>
  </section>;
}

function WorkspaceSection() {
  const benefits = [
    { icon: HardDrivesIcon, title: 'On your computer.', body: 'Your library, briefs, and export history live in a local workspace.' },
    { icon: KeyIcon, title: 'Your providers. Your keys.', body: 'Connect supported services. Credentials stay in your operating-system vault.' },
    { icon: ShieldCheckIcon, title: 'You’re in control.', body: 'Confirm requests before they run. Interrupted attempts are never silently repeated.' },
    { icon: FolderSimpleIcon, title: 'Made to keep.', body: 'Back up, restore, or move your workspace. Recover deleted work from Trash.' },
  ];
  return <section className="workspace-section" id="workspace"><div className="container workspace-grid"><div className="workspace-copy"><span className="section-kicker"><DesktopIcon size={17} /> A desktop app, through and through</span><h2>Your workspace<br /> stays with you.</h2><p className="section-intro">A little less cloud. A little more yours.<br /> Keep the work close and the process organized.</p><div className="benefits">{benefits.map(item => <div className="benefit" key={item.title}><span className="material-icon"><item.icon size={21} /></span><div><h3>{item.title}</h3><p>{item.body}</p></div></div>)}</div><p className="provider-note">Provider-backed actions send relevant prompts or images to your configured service. Provider usage is billed separately.</p></div><div className="workspace-art"><div className="workspace-icon-tray" aria-hidden="true"><span><FolderSimpleIcon size={42} /></span><span className="tray-main"><img src="/thoock-icon.svg" width="90" height="90" alt="" /></span><span><ImageIcon size={42} /></span></div><img className="workspace-window" src="/screenshots/workspace.webp" srcSet="/screenshots/workspace-480.webp 480w, /screenshots/workspace-800.webp 800w, /screenshots/workspace.webp 1200w" sizes="(max-width: 767px) calc(100vw - 40px), 550px" alt="Thoock desktop general settings with appearance and provider preferences." width="1200" height="829" loading="lazy" /><div className="local-footnote"><ShieldCheckIcon size={16} /><span>Local files. OS-protected keys. Your workspace.</span></div></div></div></section>;
}

function DownloadPanel() {
  return <section className="section container download-section" id="download" aria-labelledby="download-title"><div className="download-panel"><div className="download-copy"><div className="download-emblem"><img src="/thoock-icon.svg" width="72" height="72" alt="" /></div><h2 id="download-title">Make room for<br /> your next batch.</h2><p>Bring your stock-image production<br className="desktop-break" /> into one desktop workspace.</p><span className="download-detail"><CheckIcon size={15} /> No Thoock account needed</span><a className="latest-update-link" href="/changelog/"><span className="latest-update-version">Latest update: v{latestUpdate.version}</span><span>Updated {formatUpdateDate(latestUpdate.date)} <ArrowUpRightIcon size={12} /></span></a></div><div className="platforms">{releases.map(release => {
    const Logo = release.platform === 'macOS' ? AppleLogoIcon : WindowsLogoIcon;
    return <div className="platform" key={release.platform}><span className="platform-logo"><Logo size={27} /></span><div className="platform-info"><h3>Thoock for {release.platform}</h3><p>{release.architecture} / v{release.version} / {formatFileSize(release.bytes)}</p></div>
      {release.available ? <a className="button primary platform-download" {...downloadAnalytics(release, 'downloads')} href={release.url} download={release.url.split('/').pop()}><DownloadSimpleIcon size={16} />Download for {release.platform}</a> : <span className="unavailable">Download not available yet</span>}
      <p className="platform-release-note">{release.note}</p>
      {release.alternativeUrl && <a className="alternative-download" {...downloadAnalytics(release, 'downloads', release.alternativeUrl)} href={release.alternativeUrl} download={release.alternativeUrl.split('/').pop()}>Download ZIP instead <ArrowDownIcon size={12} /></a>}
    </div>;
  })}<a className="checksums-link" href={checksumsUrl}>View SHA-256 checksums <ArrowUpRightIcon size={12} /></a><a className="checksums-link" href="/changelog/#previous-releases">Previous versions <ArrowUpRightIcon size={12} /></a><p className="cost-note"><KeyIcon size={14} /> Bring your own API keys. Provider usage may incur charges.</p></div></div></section>;
}

function FAQ() {
  return <section className="section faq-section container" id="faq"><div className="faq-heading"><span className="section-kicker">A few things to know</span><h2>Good questions.<br /> Straight answers.</h2><p>A little context before you<br className="desktop-break" /> make yourself at home.</p></div><div className="faq-items">{questions.map(([question, answer]) => <details key={question}><summary>{question}<span className="faq-caret"><CaretDownIcon size={17} /></span></summary><p>{answer}</p></details>)}</div></section>;
}

export default function HomePage() {
  return <main id="main"><Hero /><div className="workflow-bridge container"><span className="bridge-icon"><FileCsvIcon size={23} /></span><p>Good images start before the prompt.<br /> <strong>And the work doesn’t end at generate.</strong></p><span className="bridge-line" /><span className="bridge-end"><CheckCircleIcon size={19} /> That’s where Thoock comes in.</span></div><FeatureShowcase /><WorkspaceSection /><DownloadPanel /><FAQ /></main>;
}
