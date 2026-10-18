import { downloadAnalytics } from '../analytics';
import ArrowRightIcon from 'lucide-react/dist/esm/icons/arrow-right.mjs';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/circle-check.mjs';
import { changelog, formatUpdateDate } from '../changelog';
import { releaseHistory, formatFileSize } from '../releases';
import WindowFrame from '../components/WindowFrame';

export default function ChangelogPage() {
  return <main id="main" className="changelog-page">
    <header className="changelog-page-heading container">
      <a href="/" className="text-link changelog-back"><ArrowRightIcon size={14} /> Back to Thoock</a>
      <span className="section-kicker">Changelog</span>
      <h1>What’s new.</h1>
      <p>New features, thoughtful improvements, and the details in between.</p>
    </header>
    <div id="previous-releases" className="release-history container">{changelog.map((entry, index) => <article className="release-entry" key={entry.version} id={`v${entry.version}`} aria-labelledby={`release-${entry.version}`}>
      <aside className="release-meta"><a href={`#v${entry.version}`} className="release-version" aria-label={`Link to version ${entry.version}`}>v{entry.version}</a><time dateTime={entry.date}>{formatUpdateDate(entry.date)}</time>{index === 0 && <span className="latest-badge">Latest update</span>}</aside>
      <div className="release-content"><h2 id={`release-${entry.version}`}>{entry.title}</h2><p className="release-summary">{entry.summary}</p>
        {index === 0 && <figure className="release-figure"><WindowFrame title="Thoock / Review queue"><img src="/screenshots/review.webp" srcSet="/screenshots/review-480.webp 480w, /screenshots/review-800.webp 800w, /screenshots/review.webp 1200w" sizes="(max-width: 767px) calc(100vw - 40px), 753px" width="1200" height="860" alt="Thoock desktop review queue with illustrated demo assets and quality-review controls." /></WindowFrame><figcaption>The desktop review workspace, shown with illustrated demo assets.</figcaption></figure>}
        <div className="release-highlights">{entry.highlights.map(item => <section key={item.label}><h3>{item.label}</h3><p>{item.text}</p></section>)}</div>
        <section className="release-improvements"><h3>Also in this update</h3><ul>{entry.details.map(detail => <li key={detail}>{detail}</li>)}</ul></section>
        <div className="release-availability"><span className="build-label">{entry.status}</span><p>{entry.availability}</p><div className="release-downloads" aria-label={`Downloads for version ${entry.version}`}>
          {releaseHistory.find(release => release.version === entry.version)?.downloads.map(download => <div className="release-download" key={download.platform}>
            <a className="text-link" {...downloadAnalytics(download, 'changelog')} href={download.url} download={download.url.split('/').pop()}>{download.platform} · {download.architecture} · {formatFileSize(download.bytes)} <ArrowRightIcon size={14} /></a>
            {download.alternativeUrl && <a className="text-link" {...downloadAnalytics(download, 'changelog', download.alternativeUrl)} href={download.alternativeUrl} download={download.alternativeUrl.split('/').pop()}>macOS ZIP <ArrowRightIcon size={14} /></a>}
          </div>)}
          <a className="text-link" href={`/downloads/${entry.version}/SHA256SUMS.txt`}>SHA-256 checksums <ArrowRightIcon size={14} /></a>
        </div></div>
      </div>
    </article>)}</div>
    <div className="changelog-end container"><CheckCircleIcon size={18} /><p>You’re all caught up.</p><a href="/#download" className="text-link">Back to downloads <ArrowRightIcon size={14} /></a></div>
  </main>;
}
