import { isIndexableConverterSlug } from "@/lib/indexingPolicy";

const EXACT_CONTENT_PATHS = new Set([
  "/",
  "/converter",
  "/formats",
  "/compare",
  "/convert/pdf",
]);

/**
 * Limits the AdSense script (including Auto ads) to finished, content-rich
 * screens. Legal, account, Pro preview, API, batch and low-value programmatic
 * routes stay ad-free even if someone opens them directly.
 */
export function isAdsensePathEligible(pathname?: string | null): boolean {
  const path = pathname || "/";

  if (EXACT_CONTENT_PATHS.has(path)) return true;
  if (/^\/formats\/[^/]+\/?$/.test(path)) return true;
  if (/^\/compare\/[^/]+\/?$/.test(path)) return true;
  if (/^\/convert\/pdf\/[^/]+\/?$/.test(path)) return true;

  const converterMatch = path.match(/^\/convert\/([^/]+)\/?$/);
  if (converterMatch?.[1]) {
    return isIndexableConverterSlug(converterMatch[1]);
  }

  return false;
}
