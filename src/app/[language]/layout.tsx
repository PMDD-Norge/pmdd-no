import "./global.css";
import { Nunito, Poller_One } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import Analytics from "@/components/Analytics";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { BRAND_ASSETS_QUERY } from "@/sanity/lib/queries/brandAssets";
import { SOMEPROFILES_QUERY } from "@/sanity/lib/queries/socialMediaProfiles";
import { SUPPORTED_LANGUAGES_QUERY } from "@/sanity/lib/queries/i18n";
import { NAV_QUERY } from "@/sanity/lib/queries/navigation";
import { getCustomTranslations } from "@/utils/translations";
import { GlobalTranslationKey } from "@/utils/constants/globalTranslationKeys";
import { lazy } from "react";

const Header = lazy(() => import("@/components/navigation/header/Header"));
const Footer = lazy(() => import("@/components/navigation/footer/Footer"));

export const revalidate = 3600;

const pollerOne = Poller_One({
  subsets: ["latin"],
  variable: "--font-pollerOne",
  weight: "400",
  display: "swap",
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
  preload: false, // Changed to false to prevent render blocking
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-nunito",
  display: "swap",
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
  preload: true, // Keep primary font preloaded
});

const fetchData = async (language: string) => {
  const queries = [
    sanityFetch({ query: NAV_QUERY, params: { language } }),
    sanityFetch({ query: BRAND_ASSETS_QUERY, params: {} }),
    sanityFetch({ query: SOMEPROFILES_QUERY, params: {} }),
    sanityFetch({ query: SUPPORTED_LANGUAGES_QUERY, params: {} }),
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
  params: {
    language: string;
  };
}>) {
  const { language } = await params;
  const { t } = await getCustomTranslations(language);
  const isDev = process.env.NODE_ENV === "development";
  const [messages, { nav, brandAssets, soMe, supportedLanguages }] =
    await Promise.all([getMessages(), fetchData(language)]);

  if (!messages) {
    notFound();
  }

  return (
    <html lang={language}>
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
        {!isDev && <Analytics />}
      </body>
    </html>
  );
}
