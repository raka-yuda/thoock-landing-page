import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';

// Preserve each complete capture: native title bar, sidebar, dialogs, and
// transparent window margins. Only resize and encode; never extract/crop.
const source = new URL('../../thoock-desktop-app/docs/screenshots/app/', import.meta.url);
const output = new URL('../public/screenshots/', import.meta.url);
const images = [
  ['review-queue', 'review-queue', 1500],
  ['research', 'opportunities', 1200],
  ['brief', 'commercial-briefs', 1100],
  ['review', 'review-queue', 1200],
  ['generate', 'image-generation-create', 1200],
  ['export', 'adobe-exports-prepare', 1200],
  ['dashboard', 'dashboard', 1200],
  ['generation-history', 'image-generation-history', 1200],
  ['provider-logs', 'provider-logs', 1200],
  ['research-ai', 'opportunities-research-ai', 1100],
  ['workspace', 'settings-general', 1200],
];

await mkdir(output, { recursive: true });
for (const [name, file, width] of images) {
  const input = fileURLToPath(new URL(`${file}.png`, source));
  const result = await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(fileURLToPath(new URL(`${name}.webp`, output)));
  await sharp(input)
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(fileURLToPath(new URL(`${name}-full.webp`, output)));
  console.log(`${name}: ${result.width}×${result.height}, full window preserved`);
}
