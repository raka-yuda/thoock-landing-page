import { useRef, useState } from 'react';
import ArrowsOutSimpleIcon from 'lucide-react/dist/esm/icons/maximize-2.mjs';
import ArrowRightIcon from 'lucide-react/dist/esm/icons/arrow-right.mjs';
import BookOpenIcon from 'lucide-react/dist/esm/icons/book-open.mjs';
import CheckCircleIcon from 'lucide-react/dist/esm/icons/circle-check.mjs';
import DownloadSimpleIcon from 'lucide-react/dist/esm/icons/download.mjs';
import FileCsvIcon from 'lucide-react/dist/esm/icons/file-spreadsheet.mjs';
import FileJpgIcon from 'lucide-react/dist/esm/icons/file-image.mjs';
import MagnifyingGlassIcon from 'lucide-react/dist/esm/icons/search.mjs';
import XIcon from 'lucide-react/dist/esm/icons/x.mjs';
import './features.css';

const previews = {
  research: { image: 'research', title: 'Research opportunities', caption: 'Research in the desktop demo workspace.' },
  brief: { image: 'brief', title: 'Commercial brief', caption: 'Brief editor with a sanitized example.' },
  review: { image: 'review-queue', title: 'Image review', caption: 'Product reference showing candidate images and review decisions.' },
  export: { image: 'export', title: 'Export preparation', caption: 'Export preparation in the desktop demo workspace.' },
};
type Preview = keyof typeof previews;

export default function FeatureShowcase() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [preview, setPreview] = useState<Preview>('research');
  const [previewOpen, setPreviewOpen] = useState(false);

  function openPreview(value: Preview) { setPreview(value); setPreviewOpen(true); dialog.current?.showModal(); }
  function screenshot(value: Preview, className: string) {
    const item = previews[value];
    return <button className={`feature-preview ${className}`} onClick={() => openPreview(value)} aria-label={`Enlarge ${item.title.toLowerCase()} screenshot`}>
      <span className="feature-preview-bar" aria-hidden="true"><span className="window-dots"><i /><i /><i /></span><span>{item.title}</span><ArrowsOutSimpleIcon size={13} /></span>
      <img src={`/screenshots/${item.image}.webp`} srcSet={`/screenshots/${item.image}-480.webp 480w, /screenshots/${item.image}-800.webp 800w, /screenshots/${item.image}.webp ${item.image === 'review-queue' ? 1500 : item.image === 'brief' ? 1100 : 1200}w`} sizes={value === 'brief' ? '270px' : '(max-width: 767px) 360px, 560px'} alt={item.caption} width="1200" height="850" loading="lazy" />
    </button>;
  }
  return <section className="section container feature-showcase" id="workflow" aria-labelledby="workflow-title">
    <div className="feature-intro"><span className="section-kicker">Built around the way you create</span><h2 id="workflow-title">An idea is just the beginning.<br />Give it somewhere to go.</h2><p>From “what should I make?” to a batch you can upload.<br className="desktop-break" /> The whole process lives here.</p></div>
    <div className="feature-board">
      <article className="feature-card feature-plan">
        <div className="feature-card-copy"><span className="feature-icon"><BookOpenIcon size={23} /></span><h3>Better images<br />start with a better brief.</h3><p>Research a topic. Find the buyer. Give the scene a purpose. Turn that direction into prompts you can actually work with.</p><div className="feature-capabilities"><span><MagnifyingGlassIcon size={14} /> Research & CSV import</span><span><BookOpenIcon size={14} /> Editable commercial briefs</span></div></div>
        <div className="planning-art"><div className="research-preview-wrap">{screenshot('research','research-preview')}</div><div className="brief-preview-wrap">{screenshot('brief','brief-preview')}</div><span className="idea-connection" aria-hidden="true"><ArrowRightIcon size={21} /></span></div>
      </article>
      <article className="feature-card feature-make">
        <div className="feature-card-copy"><span className="feature-icon"><CheckCircleIcon size={23} /></span><h3>Generate possibilities.<br />Keep the good ones.</h3><p>Use your chosen provider, then give every candidate a human review. Refine the metadata and decide what makes the cut.</p></div>
        <div className="review-art">{screenshot('review','review-preview')}</div>
        <div className="feature-bottom-note"><CheckCircleIcon size={15} /> Your keys. Your checks. Your final say.</div>
      </article>
      <article className="feature-card feature-deliver">
        <div className="feature-card-copy"><span className="feature-icon"><DownloadSimpleIcon size={23} /></span><h3>The last mile,<br />already organized.</h3><p>Approved JPEGs, Adobe CSV metadata, and supporting reports. One tidy ZIP, ready for your manual upload.</p></div>
        <div className="delivery-art"><div className="export-preview-wrap">{screenshot('export','export-preview')}</div><div className="deliverable-files" aria-hidden="true"><span className="deliverable-jpg"><FileJpgIcon size={38} /><small>Images</small></span><span className="deliverable-csv"><FileCsvIcon size={38} /><small>Metadata</small></span></div></div>
        <div className="feature-bottom-note"><DownloadSimpleIcon size={15} /> Prepared in Thoock. Uploaded by you.</div>
      </article>
    </div>
    <dialog ref={dialog} className="image-dialog" onClose={() => setPreviewOpen(false)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><div className="dialog-heading"><strong>{previews[preview].title} in Thoock</strong><button className="icon-button" onClick={() => dialog.current?.close()} aria-label="Close screenshot"><XIcon size={20} /></button></div>{previewOpen && <img src={`/screenshots/${previews[preview].image}.webp`} alt={previews[preview].caption} />}<p>{previews[preview].caption}</p></dialog>
  </section>;
}
