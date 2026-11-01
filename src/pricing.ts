export const configuredPaymentOrigin = import.meta.env.VITE_PAYMENT_BASE_URL?.trim();
export const pricingEnabled = Boolean(configuredPaymentOrigin);

export type Promotion = {
  code: string;
  name: string;
  endsAt: string | null;
  remaining: number | null;
};

export type CatalogProduct = {
  id: string;
  name: string;
  description: string;
  licenseTerms: {
    id: string;
    name: string;
    entitlement: string;
    durationDays: number | null;
    startsOn: 'issuance' | 'first_activation';
    deviceLimit: number;
    offlineDays: number;
    claimLimit: number | null;
    eligibilityGroup: string | null;
  };
  pricing: {
    amount: number;
    listAmount: number;
    currency: 'IDR';
    displayUsd: string | null;
    promo: Promotion | null;
  };
  checkoutAvailable: boolean;
  simulatedPayment: boolean;
  checkoutUrl: string | null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const positiveInteger = (value: unknown) => Number.isSafeInteger(value) && Number(value) > 0;

export function parseCatalog(value: unknown): CatalogProduct[] {
  if (!isRecord(value) || !Array.isArray(value.products)) throw new Error('Invalid pricing catalog');
  return value.products.map((item: unknown) => {
    if (!isRecord(item) || !isRecord(item.pricing)) throw new Error('Invalid product');
    const price = item.pricing;
    const promo = price.promo;
    const terms = item.licenseTerms;
    if (typeof item.id !== 'string' || !item.id || item.id.length > 80 ||
      typeof item.name !== 'string' || !item.name || typeof item.description !== 'string' ||
      !Number.isSafeInteger(price.amount) || Number(price.amount) < 0 ||
      !Number.isSafeInteger(price.listAmount) || Number(price.listAmount) < Number(price.amount) ||
      price.currency !== 'IDR' ||
      !isRecord(terms) || typeof terms.id !== 'string' || !terms.id ||
      typeof terms.name !== 'string' || typeof terms.entitlement !== 'string' ||
      (terms.durationDays !== null && !positiveInteger(terms.durationDays)) ||
      !['issuance', 'first_activation'].includes(String(terms.startsOn)) ||
      !positiveInteger(terms.deviceLimit) || !positiveInteger(terms.offlineDays) || Number(terms.offlineDays) > 365 ||
      (terms.claimLimit !== null && !positiveInteger(terms.claimLimit)) ||
      (terms.eligibilityGroup !== null && typeof terms.eligibilityGroup !== 'string') ||
      (price.displayUsd !== null && typeof price.displayUsd !== 'string') ||
      typeof item.checkoutAvailable !== 'boolean' || typeof item.simulatedPayment !== 'boolean' ||
      (item.checkoutUrl !== null && typeof item.checkoutUrl !== 'string') ||
      (promo !== null && (!isRecord(promo) || typeof promo.code !== 'string' || typeof promo.name !== 'string' ||
        (promo.endsAt !== null && typeof promo.endsAt !== 'string') ||
        (promo.remaining !== null && (!Number.isSafeInteger(promo.remaining) || Number(promo.remaining) < 0))))) {
      throw new Error('Invalid product');
    }
    return item as CatalogProduct;
  });
}

export function paymentOrigin(raw: string | undefined, pageUrl: string): URL | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const page = new URL(pageUrl);
    const localPage = ['localhost', '127.0.0.1'].includes(page.hostname);
    const localService = ['localhost', '127.0.0.1'].includes(url.hostname);
    if (url.protocol !== 'https:' && !(localPage && localService && url.protocol === 'http:')) return null;
    if (url.username || url.password || url.pathname !== '/' || url.search || url.hash) return null;
    return url;
  } catch {
    return null;
  }
}

export function checkoutHref(product: CatalogProduct, payment: URL): string | null {
  if (!product.checkoutAvailable || !product.checkoutUrl) return null;
  try {
    const url = new URL(product.checkoutUrl);
    if (url.origin !== payment.origin || url.searchParams.get('product') !== product.id || url.username || url.password || url.hash) return null;
    return url.href;
  } catch {
    return null;
  }
}

export const formatIdr = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
