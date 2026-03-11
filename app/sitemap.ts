import type { MetadataRoute } from "next";
import { allFormats } from "@/lib/formatData";
import { allCompareItems } from "@/lib/compareData";

const AUDIO_FORMATS = [
  "mp3",
  "wav",
  "aac",
  "m4a",
  "ogg",
  "opus",
  "flac",
  "aiff",
  "wma",
  "amr",
] as const;

const VIDEO_FORMATS = [
  "mp4",
  "webm",
  "mov",
  "mkv",
  "avi",
  "wmv",
  "flv",
  "m4v",
  "mpg",
  "mpeg",
  "3gp",
] as const;

const IMAGE_FORMATS = [
  "gif",
  "png",
  "jpg",
  "webp",
  "bmp",
  "tiff",
  "ico",
  "avif",
] as const;

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

const DEFAULT_LAST_MODIFIED = new Date("2026-03-11");

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://converto.tools";

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/converter`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/formats`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/compare`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const formatGuideEntries: MetadataRoute.Sitemap = allFormats.map((format) => ({
    url: `${siteUrl}/formats/${format.slug}`,
    lastModified: DEFAULT_LAST_MODIFIED,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const compareEntries: MetadataRoute.Sitemap = allCompareItems.map((item) => ({
    url: `${siteUrl}/compare/${item.slug}`,
    lastModified: DEFAULT_LAST_MODIFIED,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const converterSlugs = unique([
    ...buildPairSlugs(AUDIO_FORMATS, AUDIO_FORMATS),
    ...buildPairSlugs(VIDEO_FORMATS, AUDIO_FORMATS),
    ...buildPairSlugs(VIDEO_FORMATS, VIDEO_FORMATS),
    ...buildPairSlugs(VIDEO_FORMATS, IMAGE_FORMATS),
    ...buildPairSlugs(IMAGE_FORMATS, IMAGE_FORMATS),
  ]);

  const converterEntries: MetadataRoute.Sitemap = converterSlugs.map((slug) => ({
    url: `${siteUrl}/convert/${slug}`,
    lastModified: DEFAULT_LAST_MODIFIED,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    ...staticEntries,
    ...formatGuideEntries,
    ...compareEntries,
    ...converterEntries,
  ];
}