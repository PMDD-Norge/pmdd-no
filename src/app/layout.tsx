import "./global.css";
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
import { fontVariables } from "@/config/fonts";

// No cache during development for faster iterations
// Note: Next.js requires static values for revalidate export
export const revalidate = 0;

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
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body className={fontVariables}>
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
