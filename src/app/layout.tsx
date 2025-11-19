import "./global.css";
import { Nunito, Poller_One } from "next/font/google";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity";
import {
  BRAND_ASSETS_QUERY,
  NAVIGATION_QUERY,
} from "@/sanity/lib/queries";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { DisableDraftMode } from "@/components/disableDraftMode/DisableDraftMode";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import Header from "@/components/navigation/header/Header";
import Footer from "@/components/navigation/footer/Footer";

// No cache during development for faster iterations
export const revalidate = 0;

const pollerOne = Poller_One({
  subsets: ["latin"],
  variable: "--font-pollerOne",
  weight: "400",
  display: "swap", // Ensure fonts show up in production
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
  preload: true, // Force preload in production
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-nunito",
  display: "swap", 
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
  preload: true,
});

const fetchData = async () => {
  const queries = [
    sanityFetch({
      query: NAVIGATION_QUERY,
      params: {},
      tags: ["navigation"],
    }),
    sanityFetch({
      query: BRAND_ASSETS_QUERY,
      params: {},
      tags: ["brandAssets"],
    }),
  ];

  const [navResponse, brandAssetsResponse] =
    await Promise.all(queries);

  return {
    nav: navResponse.data,
    brandAssets: brandAssetsResponse.data,
  };
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === "development";
  const { isEnabled: isDraftMode } = await draftMode();
  const { nav, brandAssets } = await fetchData();

  return (
    <html lang="no">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />

        {/* Critical font loading for production */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&family=Poller+One:wght@400&display=swap"
        />
      </head>
      <body className={`${nunito.variable} ${pollerOne.variable}`}>
        <a href="#main" className="skipLink">
          Hopp til hovedinnhold
        </a>
        <Header
          navigation={nav}
          assets={brandAssets}
        />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer navigationData={nav} />
        {isDev && <SanityLive />}
        {isDraftMode && (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        )}
        {!isDev && (
          <>
            <Analytics />
            <SpeedInsights />
            <ServiceWorkerRegistration />
          </>
        )}
      </body>
    </html>
  );
}
