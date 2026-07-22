/**
 * Single canonical production origin used by metadata, sitemap and structured data.
 * Keeping this constant prevents an environment variable from accidentally
 * publishing apex/non-www URLs that immediately redirect.
 */
export const SITE_URL = "https://www.converto.tools";
