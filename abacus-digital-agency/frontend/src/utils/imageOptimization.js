/**
 * Injects Cloudinary transformation parameters into an existing Cloudinary
 * URL (format=auto + quality=auto + width) so images are served as
 * WebP/AVIF where supported and properly sized instead of shipping a
 * full-resolution original to every viewport. No-ops for non-Cloudinary
 * URLs (e.g. the Picsum placeholder images used in seed data) so this is
 * always safe to call.
 *
 * @param {string} url
 * @param {{ width?: number, quality?: string|number }} [options]
 */
export function optimizeImageUrl(url, { width, quality = 'auto' } = {}) {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return url;
  }

  const transformations = [`f_auto`, `q_${quality}`];
  if (width) transformations.push(`w_${width}`);

  return url.replace('/upload/', `/upload/${transformations.join(',')}/`);
}

/**
 * Builds a srcSet string across common breakpoints for a Cloudinary image,
 * for use with <img srcSet> when an image needs to be genuinely responsive
 * (large hero/cover images). Skipped for non-Cloudinary URLs.
 */
export function buildSrcSet(url, widths = [400, 800, 1200, 1600]) {
  if (!url || !url.includes('res.cloudinary.com')) return undefined;
  return widths.map((w) => `${optimizeImageUrl(url, { width: w })} ${w}w`).join(', ');
}
