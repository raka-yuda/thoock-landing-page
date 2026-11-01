import { useEffect, useState } from 'react';
import ArrowUpRightIcon from 'lucide-react/dist/esm/icons/arrow-up-right.mjs';
import CheckIcon from 'lucide-react/dist/esm/icons/check.mjs';
import RefreshCwIcon from 'lucide-react/dist/esm/icons/refresh-cw.mjs';
import SearchIcon from 'lucide-react/dist/esm/icons/search.mjs';
import BookIcon from 'lucide-react/dist/esm/icons/book-open.mjs';
import ImagesIcon from 'lucide-react/dist/esm/icons/images.mjs';
import ScanIcon from 'lucide-react/dist/esm/icons/scan-eye.mjs';
import FileIcon from 'lucide-react/dist/esm/icons/file-spreadsheet.mjs';
import FolderIcon from 'lucide-react/dist/esm/icons/folder.mjs';
import { checkoutHref, formatIdr, parseCatalog, paymentOrigin, type CatalogProduct } from '../pricing';

type PricingState = { status: 'loading' | 'unavailable' | 'unconfigured' } | { status: 'ready'; products: CatalogProduct[] };
const configuredPaymentOrigin = import.meta.env.VITE_PAYMENT_BASE_URL ?? (import.meta.env.DEV ? 'http://localhost:3000' : undefined);
const strengths = [
  { icon: SearchIcon, title: 'Find a direction', copy: 'Research opportunities and keep promising topics close to the work.' },
  { icon: BookIcon, title: 'Give each batch a brief', copy: 'Turn ideas into commercial briefs before you start creating.' },
  { icon: ImagesIcon, title: 'Create or bring your own', copy: 'Generate image candidates or import your existing images and videos.' },
  { icon: ScanIcon, title: 'Review before you submit', copy: 'Inspect quality, make decisions, and refine titles and keywords together.' },
  { icon: FileIcon, title: 'Prepare the final package', copy: 'Export files and metadata for your stock submission workflow.' },
  { icon: FolderIcon, title: 'Keep your work connected', copy: 'Organize briefs, images, and export history in a local desktop workspace.' },
];

function Offer({ product, payment, localPage }: { product: CatalogProduct; payment: URL | null; localPage: boolean }) {
  const { licenseTerms: terms, pricing } = product;
  const trial = terms.entitlement === 'trial';
  const free = pricing.amount === 0;
  const checkout = payment && (!product.simulatedPayment || localPage) ? checkoutHref(product, payment) : null;
  const duration = terms.durationDays === null ? 'No license expiry' : `${terms.durationDays} days from ${terms.startsOn === 'first_activation' ? 'your first activation' : 'license issuance'}`;
  const action = product.simulatedPayment ? 'Try test checkout' : trial ? (free ? 'Start free trial' : 'Get trial license') : free ? 'Get free license' : 'Buy license';
  return <article className={`pricing-panel pricing-offer${trial ? ' pricing-trial' : ''}`} data-product-id={product.id}>
    <div className="pricing-product"><span className="pricing-caption">{trial ? 'Try it with your own workflow' : 'Make it your workspace'}</span><h3>{product.name}</h3><p>{product.description}</p></div>
    <div className="pricing-purchase"><div className="pricing-amount">{free ? 'Free' : formatIdr(pricing.amount)}{pricing.listAmount > pricing.amount && <span className="pricing-list-price">{formatIdr(pricing.listAmount)}</span>}</div><p className="pricing-payment-note">{free ? 'No card required' : 'One-time payment. No subscription.'}</p>{!free && pricing.displayUsd && <p className="pricing-usd">About {pricing.displayUsd} USD for reference. Checkout charges IDR.</p>}
      {pricing.promo && <p className="pricing-promo">{pricing.promo.name} <span>Code {pricing.promo.code}</span></p>}
      <ul className="pricing-terms"><li><CheckIcon size={16} />{duration}</li><li><CheckIcon size={16} />{terms.deviceLimit === 1 ? 'Activate on 1 device' : `Activate on up to ${terms.deviceLimit} devices`}</li>{terms.claimLimit !== null && <li><CheckIcon size={16} />{terms.claimLimit === 1 ? 'One claim' : `Up to ${terms.claimLimit} claims`} per email and installation</li>}</ul>
    </div>
    <div className="pricing-card-footer">{checkout ? <a className="button primary pricing-buy" href={checkout} data-umami-event={trial ? 'trial-start' : 'checkout-start'} data-umami-event-product={product.id}>{action}<ArrowUpRightIcon size={16} /></a> : <span className="pricing-unavailable">{product.simulatedPayment ? 'Test checkout is unavailable here' : trial ? 'Trial is temporarily unavailable' : 'Checkout is not available yet'}</span>}<p className="pricing-delivery">{free ? 'Get your key, then download and activate Thoock.' : 'Your license key is issued after payment.'}</p></div>
  </article>;
}

export default function PricingSection() {
  const [state, setState] = useState<PricingState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const payment = paymentOrigin(configuredPaymentOrigin, window.location.href);
    if (!payment) { setState({ status: 'unconfigured' }); return; }
    const controller = new AbortController();
    setState({ status: 'loading' });
    fetch(new URL('/api/pricing', payment), { cache: 'no-store', signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error(`Pricing request failed: ${response.status}`);
        return parseCatalog(await response.json());
      })
      .then(products => setState({ status: 'ready', products }))
      .catch(() => { if (!controller.signal.aborted) setState({ status: 'unavailable' }); });
    return () => controller.abort();
  }, [attempt]);
  const payment = typeof window === 'undefined' ? null : paymentOrigin(configuredPaymentOrigin, window.location.href);
  const localPage = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
  // Keep trial first regardless of the catalog's creation order. IDs and terms remain API-owned.
  const products = state.status === 'ready' ? [...state.products].sort((a, b) => Number(b.licenseTerms.entitlement === 'trial') - Number(a.licenseTerms.entitlement === 'trial')) : [];
  return <section className="section pricing-section container" id="pricing" aria-labelledby="pricing-title">
    <div className="pricing-heading"><span className="section-kicker">A workspace for your whole process</span><h2 id="pricing-title">Find your flow.<br />Make it yours.</h2><p>From the first opportunity to the final package. Choose a license, get your key, and bring your next batch into Thoock.</p></div>
    <div className="pricing-offers" aria-live="polite" aria-busy={state.status === 'loading'}>
      {state.status === 'loading' && <div className="pricing-panel pricing-loading" role="status"><span className="pricing-placeholder pricing-placeholder-title" /><span className="pricing-placeholder pricing-placeholder-copy" /><span className="pricing-placeholder pricing-placeholder-price" /><span className="pricing-placeholder pricing-placeholder-button" /><span className="sr-only">Checking current pricing</span></div>}
      {(state.status === 'unavailable' || state.status === 'unconfigured') && <div className="pricing-panel pricing-message" role="status"><div><h3>Pricing is temporarily unavailable.</h3><p>Please check back for available licenses. Already have a key? You can download the app below.</p></div>{state.status === 'unavailable' && <button className="button" type="button" onClick={() => setAttempt(value => value + 1)}><RefreshCwIcon size={16} />Try again</button>}</div>}
      {state.status === 'ready' && (products.length ? products.map(product => <Offer key={product.id} product={product} payment={payment} localPage={localPage} />) : <div className="pricing-panel pricing-message"><div><h3>No licenses available right now.</h3><p>Check back for available licenses. Existing license holders can still download the app.</p></div></div>)}
    </div>
    <div className="pricing-strengths"><h3>More than a place to add keywords.</h3><div className="pricing-strengths-grid">{strengths.map(({ icon: Icon, title, copy }) => <div className="pricing-strength" key={title}><span className="material-icon"><Icon size={20} /></span><div><h4>{title}</h4><p>{copy}</p></div></div>)}</div><p className="pricing-provider-note">Bring your own AI keys. The license covers Thoock; AI provider usage is billed separately. Provider-backed actions send relevant content to the service you choose.</p></div>
    <p className="pricing-existing">Already have a trial or paid license? <a href="/#download">Download Thoock <ArrowUpRightIcon size={13} /></a></p>
  </section>;
}
