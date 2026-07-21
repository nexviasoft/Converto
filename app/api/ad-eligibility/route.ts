import { NextRequest, NextResponse } from "next/server";
import {
  ADSTERRA_ALL_ADS_ENABLED,
  ADSTERRA_ALLOW_UNKNOWN_COUNTRY,
  ADSTERRA_BLOCKED_COUNTRIES,
} from "@/lib/adsterraConfig";

export const dynamic = "force-dynamic";

function normalizeCountry(value: string | null) {
  const country = value?.trim().toUpperCase();
  return country && /^[A-Z]{2,3}$/.test(country) ? country : null;
}

function getRequestCountry(request: NextRequest) {
  return normalizeCountry(
    request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      request.headers.get("cloudfront-viewer-country") ||
      request.headers.get("x-country-code"),
  );
}

export function GET(request: NextRequest) {
  const country = getRequestCountry(request);
  const isBlockedCountry = country
    ? ADSTERRA_BLOCKED_COUNTRIES.includes(country)
    : !ADSTERRA_ALLOW_UNKNOWN_COUNTRY;

  const adsAllowed = ADSTERRA_ALL_ADS_ENABLED && !isBlockedCountry;

  return NextResponse.json(
    {
      adsAllowed,
      country,
    },
    {
      headers: {
        "Cache-Control": "private, no-store, max-age=0, must-revalidate",
        Vary: "x-vercel-ip-country",
      },
    },
  );
}
