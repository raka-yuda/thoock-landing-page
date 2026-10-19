/** A display label only; numeric release identifiers remain unchanged. */
export function BetaBadge({ version }: { version: string }) {
  return version.split('.')[0] === '0'
    ? <span className="beta-badge">Beta</span>
    : null;
}
