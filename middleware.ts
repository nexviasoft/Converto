import { NextRequest, NextResponse } from "next/server";
import { ADSTERRA_BLOCKED_COUNTRIES } from "@/lib/adsterraConfig";

const CANONICAL_HOST = "www.converto.tools";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") ?? "";

  const isLocalhost =
    host.includes("localhost") || host.startsWith("127.0.0.1");

  const isVercel = host.includes(".vercel.app");
  const country = request.headers.get("x-vercel-ip-country")?.trim().toUpperCase();

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

  // SADECE production domain dışındaysa ve vercel değilse redirect et
  if (!isLocalhost && !isVercel && host !== CANONICAL_HOST) {
    return NextResponse.redirect(`https://${CANONICAL_HOST}${url.pathname}${url.search}`, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};