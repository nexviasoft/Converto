import type { MetadataRoute } from "next";
import { allFormats } from "@/lib/formatData";
import { allCompareItems } from "@/lib/compareData";
import { INDEXABLE_CONVERTER_SLUGS } from "@/lib/indexingPolicy";
import { PRO_PUBLIC } from "@/lib/siteReadiness";

const DEFAULT_LAST_MODIFIED = new Date("2026-07-06");

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.converto.tools";

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
      url: `${siteUrl}/convert/pdf`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${siteUrl}/convert/pdf/split`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.82,
    },
    {
      url: `${siteUrl}/convert/pdf/to-png`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.82,
    },
    {
      url: `${siteUrl}/convert/pdf/to-jpg`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.82,
    },
    {
      url: `${siteUrl}/convert/pdf/to-webp`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.82,
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
      url: `${siteUrl}/about`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.45,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.35,
    },
    ...(PRO_PUBLIC
      ? [
          {
            url: `${siteUrl}/pro`,
            lastModified: DEFAULT_LAST_MODIFIED,
            changeFrequency: "weekly" as const,
            priority: 0.55,
          },
        ]
      : []),
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
    {
      url: `${siteUrl}/cookies`,
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

  const converterEntries: MetadataRoute.Sitemap =
    INDEXABLE_CONVERTER_SLUGS.map((slug) => ({
      url: `${siteUrl}/convert/${slug}`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.82,
    }));

  return [
    ...staticEntries,
    ...formatGuideEntries,
    ...compareEntries,
    ...converterEntries,
  ];
}
