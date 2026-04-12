import { NextRequest, NextResponse } from "next/server";

const CANONICAL_HOST = "www.converto.tools";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") ?? "";

  const isLocalhost =
    host.includes("localhost") || host.startsWith("127.0.0.1");

  const isVercel = host.includes(".vercel.app");

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