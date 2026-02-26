/**
 * Resolves a thumbnail source for a publication.
 * - External URLs (http/https) pass through as-is
 * - Legacy relative paths (images/foo.png) remap to /images/thumbnails/foo.png
 * - null/undefined returns null (component renders a placeholder)
 */
export function resolveThumbnailSrc(thumbnail: string | null | undefined): string | null {
  if (!thumbnail) return null;

  // External URL — pass through
  if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://')) {
    return thumbnail;
  }

  // Legacy relative path from old site (e.g. "images/foo.png")
  const filename = thumbnail.split('/').pop();
  if (filename) {
    return `/images/thumbnails/${filename}`;
  }

  return null;
}
