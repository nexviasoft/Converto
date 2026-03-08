import type { MetadataRoute } from "next";

const AUDIO_FORMATS = ["mp3", "wav", "aac", "m4a", "ogg", "opus", "flac"] as const;
const VIDEO_FORMATS = ["mp4", "webm", "mov"] as const;
const IMAGE_FORMATS = ["gif"] as const;

function buildPairSlugs(
  fromFormats: readonly string[],
  toFormats: readonly string[]
): string[] {
  const slugs: string[] = [];

  for (const from of fromFormats) {
    for (const to of toFormats) {
      if (from === to) continue;
      slugs.push(`${from}-to-${to}`);
    }
  }

  return slugs;
}

function unique(items: string[]) {
  return [...new Set(items)];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://converto.tools";

  const now = new Date();

  const staticRoutes = ["/", "/privacy", "/terms", "/converter", "/formats"];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : path === "/formats" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/formats" ? 0.85 : 0.7,
  }));

  const converterSlugs = unique([
    ...buildPairSlugs(AUDIO_FORMATS, AUDIO_FORMATS),
    ...buildPairSlugs(VIDEO_FORMATS, AUDIO_FORMATS),
    ...buildPairSlugs(VIDEO_FORMATS, VIDEO_FORMATS),
    ...buildPairSlugs(VIDEO_FORMATS, IMAGE_FORMATS),
    ...buildPairSlugs(IMAGE_FORMATS, VIDEO_FORMATS),
  ]);

  const converterEntries: MetadataRoute.Sitemap = converterSlugs.map((slug) => ({
    url: `${siteUrl}/convert/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...converterEntries];
}