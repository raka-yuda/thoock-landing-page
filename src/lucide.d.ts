// Lucide ships its public types at the package root. Direct ESM imports keep
// development from downloading the complete icon catalog.
declare module 'lucide-react/dist/esm/icons/*.mjs' {
  import type { LucideIcon } from 'lucide-react';
  const Icon: LucideIcon;
  export default Icon;
}
