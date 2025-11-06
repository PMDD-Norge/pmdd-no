import "./global.css";
import { Nunito, Poller_One } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity";
import { BRAND_ASSETS_QUERY } from "@/sanity/lib/queries/brandAssets";
import { SOMEPROFILES_QUERY } from "@/sanity/lib/queries/socialMediaProfiles";
import { SUPPORTED_LANGUAGES_QUERY } from "@/sanity/lib/queries/i18n";
import { NAV_QUERY } from "@/sanity/lib/queries/navigation";
import { getCustomTranslations } from "@/utils/translations";
import { GlobalTranslationKey } from "@/utils/constants/globalTranslationKeys";
import { lazy } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { DisableDraftMode } from "@/components/disableDraftMode/DisableDraftMode";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const Header = lazy(() => import("@/components/navigation/header/Header"));
const Footer = lazy(() => import("@/components/navigation/footer/Footer"));

export const revalidate = 300; // 5 minute cache for better performance

const pollerOne = Poller_One({
  subsets: ["latin"],
  variable: "--font-pollerOne",
  weight: "400",
  display: "optional", // Better performance than swap
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
  preload: false,
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

const fetchData = async (language: string) => {
  const queries = [
    sanityFetch({
      query: NAV_QUERY,
      params: { language },
      tags: ["navigation"],
    }),
    sanityFetch({
      query: BRAND_ASSETS_QUERY,
      params: {},
      tags: ["brandAssets"],
    }),
    sanityFetch({
      query: SOMEPROFILES_QUERY,
      params: {},
      tags: ["socialMedia"],
    }),
    sanityFetch({
      query: SUPPORTED_LANGUAGES_QUERY,
      params: {},
      tags: ["languages"],
    }),
  ];

  const [
    navResponse,
    brandAssetsResponse,
    soMeResponse,
    supportedLanguagesResponse,
  ] = await Promise.all(queries);

  return {
    nav: navResponse.data,
    brandAssets: brandAssetsResponse.data,
    soMe: soMeResponse.data,
    supportedLanguages: supportedLanguagesResponse.data,
  };
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{
    language: string;
  }>;
}>) {
  const { language } = await params;
  const { t } = await getCustomTranslations(language);
  const isDev = process.env.NODE_ENV === "development";
  const { isEnabled: isDraftMode } = await draftMode();
  const [messages, { nav, brandAssets, soMe, supportedLanguages }] =
    await Promise.all([getMessages(), fetchData(language)]);

  if (!messages) {
    notFound();
  }

  return (
    <html lang={language}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body className={`${nunito.variable} ${pollerOne.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <a href="#main" className="skipLink">
            {t(GlobalTranslationKey.skipToMain)}
          </a>
          <Header
            navigation={nav}
            assets={brandAssets}
            currentLanguage={language}
            supportedLanguages={supportedLanguages}
          />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer navigationData={nav} soMeData={soMe} />
        </NextIntlClientProvider>
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
