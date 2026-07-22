/**
 * Routes that currently have fully hand-written, route-specific editorial content.
 *
 * These pages are the safest converter landing pages to expose to search engines
 * and monetise while the broader programmatic route library is still being improved.
 */
export const INDEXABLE_CONVERTER_SLUGS = [
  "mp4-to-mp3",
  "webm-to-mp3",
  "mov-to-mp4",
  "mkv-to-mp4",
  "png-to-jpg",
  "webp-to-png",
  "jpg-to-png",
  "mp4-to-gif",
  "flac-to-mp3",
  "wav-to-mp3",
  "avi-to-mp4",
  "mp4-to-wav",
  "mov-to-mp3",
  "png-to-webp",
  "jpg-to-webp",
  "png-to-ico",
  "tiff-to-jpg",
] as const;

const INDEXABLE_CONVERTER_SLUG_SET = new Set<string>(
  INDEXABLE_CONVERTER_SLUGS,
);

export function isIndexableConverterSlug(slug: string): boolean {
  return INDEXABLE_CONVERTER_SLUG_SET.has(slug.toLowerCase());
}
