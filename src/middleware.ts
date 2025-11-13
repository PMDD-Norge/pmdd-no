import { NextRequest, NextResponse } from "next/server";

// Static redirects configuration - easy to manage without database calls
const STATIC_REDIRECTS: Record<string, { to: string; type: number }> = {
  "/informasjon-om-pmdd": { to: "/informasjon", type: 301 },
  // Add more redirects here as needed
};

export default function middleware(request: NextRequest) {
  const { nextUrl } = request;

  // Check for static redirects
  const redirect = STATIC_REDIRECTS[nextUrl.pathname];
  if (redirect) {
    const redirectUrl = new URL(redirect.to, request.url);
    return NextResponse.redirect(redirectUrl, redirect.type);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Exclude request paths starting with:
     * - api (API routes)
     * - sw.js (Service Worker)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _assets (asset files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - studio, shared (Sanity studios)
     */
    "/((?!api|sw.js|_next/static|_next/image|_assets|favicon.ico|sitemap.xml|robots.txt|studio).*)",
  ],
};
