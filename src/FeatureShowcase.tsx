import { useId, useLayoutEffect, useRef, useState } from 'react';
import ArrowsOutSimpleIcon from 'lucide-react/dist/esm/icons/maximize-2.mjs';
import XIcon from 'lucide-react/dist/esm/icons/x.mjs';
import './features.css';

const previews = {
  research: { image: 'research', title: 'Research opportunities', caption: 'Opportunities', alt: 'Full Thoock window showing research topics, buyers, and opportunity scores.', width: 1200, height: 829 },
  brief: { image: 'brief', title: 'Commercial briefs', caption: 'Commercial briefs', alt: 'Full Thoock window showing commercial briefs, buyers, prompts, and linked images.', width: 1100, height: 760 },
  researchAi: { image: 'research-ai', title: 'AI-assisted research', caption: 'Research with AI', alt: 'Full Thoock window with the AI research dialog open.', width: 1100, height: 760 },
  generate: { image: 'generate', title: 'Image generation', caption: 'Generate or import', alt: 'Full Thoock window with image generation settings and existing-image import.', width: 1200, height: 829 },
  review: { image: 'review-queue', title: 'Image review', caption: 'Review and decide', alt: 'Full Thoock review window with candidate images, checks, metadata, and decisions.', width: 1500, height: 1036 },
  export: { image: 'export', title: 'Export preparation', caption: 'Prepare the package', alt: 'Full Thoock export window with approved images and metadata ready for packaging.', width: 1200, height: 829 },
  dashboard: { image: 'dashboard', title: 'Workspace dashboard', caption: 'The whole workspace', alt: 'Full Thoock dashboard window showing the production pipeline and recent activity.', width: 1200, height: 829 },
  history: { image: 'generation-history', title: 'Generation history', caption: 'Generation history', alt: 'Full Thoock window showing generation attempts, status, and result checks.', width: 1200, height: 829 },
  logs: { image: 'provider-logs', title: 'Provider logs', caption: 'Provider activity', alt: 'Full Thoock provider-log window showing operations, status, and duration.', width: 1200, height: 829 },
};
type Preview = keyof typeof previews;
const halfScreen = '(max-width: 767px) calc((100vw - 52px) / 2), (max-width: 1100px) 35vw, 406px';
const wideScreen = '(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) 85vw, 1040px';

export default function FeatureShowcase() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const titleId = useId();
  const item = preview === null ? null : previews[preview];

  useLayoutEffect(() => {
    if (preview === null) return;
    const element = dialog.current!;
    element.showModal();
    return () => { if (element.open) element.close(); };
  }, [preview]);

  function screenshot(value: Preview, sizes = halfScreen, className = '') {
    const screen = previews[value];
    return <figure className={`product-screen ${className}`}>
      <button className="feature-preview" onClick={() => setPreview(value)} aria-label={`Enlarge ${screen.title.toLowerCase()} screenshot`}>
        <img src={`/screenshots/${screen.image}.webp`} srcSet={`/screenshots/${screen.image}-480.webp 480w, /screenshots/${screen.image}-800.webp 800w, /screenshots/${screen.image}.webp ${screen.width}w`} sizes={sizes} alt={screen.alt} width={screen.width} height={screen.height} loading="lazy" decoding="async" />
        <span className="preview-expand" aria-hidden="true"><ArrowsOutSimpleIcon size={15} /></span>
      </button>
      <figcaption>{screen.caption}</figcaption>
    </figure>;
  }

  return <section className="section container feature-showcase" id="workflow" aria-labelledby="workflow-title">
    <div className="feature-intro"><span className="section-kicker">A place for the whole process</span><h2 id="workflow-title">One idea. Many possibilities.<br />One place to bring it together.</h2><p>The direction, the images, and the details that make them ready. Keep the whole batch connected.</p></div>

    <div className="feature-board">
      <article className="feature-card story-planning" aria-labelledby="planning-title">
        <div className="story-heading"><h3 id="planning-title">A little direction.<br />A lot more possibility.</h3><p>Your research becomes a brief with a buyer, a purpose, and room to explore. Bring your own ideas or work with your chosen AI provider.</p></div>
        <div className="story-scene planning-scene">
          {screenshot('research', '(max-width: 767px) calc(100vw - 40px), 62vw', 'scene-main')}
          <div className="scene-companions">{screenshot('researchAi', halfScreen)}{screenshot('brief', halfScreen)}</div>
        </div>
      </article>

      <article className="feature-card story-making" aria-labelledby="making-title">
        <div className="story-heading"><h3 id="making-title">Make the possibilities.<br />Keep the ones that matter.</h3><p>Generate with your provider or import existing images. Review the quality, refine the metadata, and give every image your final say.</p></div>
        <div className="story-scene making-scene">{screenshot('generate', '(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) 46vw, 548px')}{screenshot('review', '(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) 46vw, 548px')}</div>
        <ul className="story-notes" aria-label="Production features"><li>Your providers and API keys</li><li>Original files kept</li><li>Human review before export</li></ul>
      </article>

      <article className="feature-card story-delivery" aria-labelledby="delivery-title">
        <div className="story-heading"><h3 id="delivery-title">The files. The details.<br />The next batch.</h3><p>Approved images, Adobe CSV metadata, and reports in one package. A clear view of the workspace keeps the next round moving.</p></div>
        <div className="story-scene delivery-scene">{screenshot('export', wideScreen, 'delivery-main')}<div className="contact-strip">{screenshot('dashboard', '(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) 30vw, 357px')}{screenshot('history', halfScreen)}{screenshot('logs', halfScreen)}</div></div>
        <div className="feature-end"><p>Open any screen for a closer look.</p><span>Prepared in Thoock. Uploaded by you.</span></div>
      </article>
    </div>

    <dialog ref={dialog} className="image-dialog" aria-labelledby={titleId} onClose={() => setPreview(null)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="dialog-heading"><strong id={titleId}>{item ? `${item.title} in Thoock` : 'Screenshot preview'}</strong><button className="icon-button" onClick={() => dialog.current?.close()} aria-label="Close screenshot"><XIcon size={20} /></button></div>
      {item && <><img src={`/screenshots/${item.image}-full.webp`} alt={item.alt} /><p>{item.caption}</p></>}
    </dialog>
  </section>;
}
