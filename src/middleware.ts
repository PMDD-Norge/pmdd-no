import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

// Define supported locales
const locales = ["no"];

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: "no",
  localePrefix: "never",
});

// Static redirects configuration - easy to manage without database calls
const STATIC_REDIRECTS: Record<string, { to: string; type: number }> = {
  "/informasjon-om-pmdd": { to: "/informasjon", type: 301 },
  // Add more redirects here as needed
};

export default function middleware(request: NextRequest) {
  const { nextUrl } = request;

  // If the URL starts with /no/, redirect to /
  if (nextUrl.pathname.startsWith("/no/")) {
    const newUrl = new URL(nextUrl.pathname.replace(/^\/no/, ""), request.url);
    return NextResponse.redirect(newUrl);
  }

  // Check for static redirects
  const redirect = STATIC_REDIRECTS[nextUrl.pathname];
  if (redirect) {
    const redirectUrl = new URL(redirect.to, request.url);
    return NextResponse.redirect(redirectUrl, redirect.type);
  }

  return intlMiddleware(request);
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
