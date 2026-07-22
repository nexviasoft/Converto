import { SITE_URL } from "@/lib/siteUrl";
import type { MetadataRoute } from "next";
import { allFormats } from "@/lib/formatData";
import { allCompareItems } from "@/lib/compareData";
import { INDEXABLE_CONVERTER_SLUGS } from "@/lib/indexingPolicy";
import { PRO_PUBLIC } from "@/lib/siteReadiness";
import { allEditorialGuides } from "@/lib/editorialGuides";

const DEFAULT_LAST_MODIFIED = new Date("2026-07-22");

export default function sitemap(): MetadataRoute.Sitemap {

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/converter`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/convert/pdf`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${SITE_URL}/convert/pdf/split`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.82,
    },
    {
      url: `${SITE_URL}/convert/pdf/to-png`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.82,
    },
    {
      url: `${SITE_URL}/convert/pdf/to-jpg`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.82,
    },
    {
      url: `${SITE_URL}/convert/pdf/to-webp`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.82,
    },
    {
      url: `${SITE_URL}/formats`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/compare`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/guides`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.78,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.45,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.35,
    },
    ...(PRO_PUBLIC
      ? [
          {
            url: `${SITE_URL}/pro`,
            lastModified: DEFAULT_LAST_MODIFIED,
            changeFrequency: "weekly" as const,
            priority: 0.55,
          },
        ]
      : []),
    {
      url: `${SITE_URL}/privacy`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/cookies`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const formatGuideEntries: MetadataRoute.Sitemap = allFormats.map((format) => ({
    url: `${SITE_URL}/formats/${format.slug}`,
    lastModified: DEFAULT_LAST_MODIFIED,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const compareEntries: MetadataRoute.Sitemap = allCompareItems.map((item) => ({
    url: `${SITE_URL}/compare/${item.slug}`,
    lastModified: DEFAULT_LAST_MODIFIED,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const editorialGuideEntries: MetadataRoute.Sitemap = allEditorialGuides.map((guide) => ({
    url: `${SITE_URL}/guides/${guide.slug}`,
    lastModified: DEFAULT_LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: 0.78,
  }));

  const converterEntries: MetadataRoute.Sitemap =
    INDEXABLE_CONVERTER_SLUGS.map((slug) => ({
      url: `${SITE_URL}/convert/${slug}`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.82,
    }));

  return [
    ...staticEntries,
    ...formatGuideEntries,
    ...compareEntries,
    ...editorialGuideEntries,
    ...converterEntries,
  ];
}
