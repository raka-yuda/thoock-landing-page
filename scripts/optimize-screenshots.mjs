import sharp from 'sharp';
// Originals stay intact for enlarged previews. Small derivatives serve cards/mobile.
for (const name of ['review-queue', 'research', 'brief', 'review', 'generate', 'export', 'workspace']) {
  for (const width of [480, 800]) {
    await sharp(`public/screenshots/${name}.webp`).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`public/screenshots/${name}-${width}.webp`);
  }
}
