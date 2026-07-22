import { NextRequest, NextResponse } from "next/server";
import { ADSTERRA_BLOCKED_COUNTRIES } from "@/lib/adsterraConfig";

const CANONICAL_HOST = "www.converto.tools";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = url.hostname.toLowerCase();
  const forwardedProto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    url.protocol.replace(":", "");

  const isLocalhost =
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  const isVercelPreview = hostname.endsWith(".vercel.app");
  const country = request.headers
    .get("x-vercel-ip-country")
    ?.trim()
    .toUpperCase();

  // Defense in depth: never serve local Adsterra iframe pages to blocked countries.
  if (
    url.pathname.startsWith("/adsterra/") &&
    country &&
    ADSTERRA_BLOCKED_COUNTRIES.includes(country)
  ) {
    return new NextResponse(null, {
      status: 204,
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  }

  // Keep previews/local development usable, but force every production request
  // onto one HTTPS + www origin in a single permanent redirect.
  if (
    !isLocalhost &&
    !isVercelPreview &&
    (hostname !== CANONICAL_HOST || forwardedProto !== "https")
  ) {
    url.protocol = "https:";
    url.hostname = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image).*)"],
};
