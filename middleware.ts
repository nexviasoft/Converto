import { NextRequest, NextResponse } from "next/server";

const CANONICAL_HOST = "www.converto.tools";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") ?? "";

  const allowedHosts = [
    CANONICAL_HOST,
    "localhost:3000",
    "127.0.0.1:3000",
  ];

  const isPreview = host.endsWith(".vercel.app");

  if (!allowedHosts.includes(host) && !isPreview) {
    url.protocol = "https";
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};