import "./global.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Nunito, Poller_One } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { NAV_QUERY } from "@/sanity/lib/queries/navigation";
import { BRAND_ASSETS_QUERY } from "@/sanity/lib/queries/brandAssets";
import { SOMEPROFILES_QUERY } from "@/sanity/lib/queries/socialMediaProfiles";
import { SUPPORTED_LANGUAGES_QUERY } from "@/sanity/lib/queries/i18n";
import SkipToMain from "@/components/skipToMain/SkipToMain";
import { Header } from "@/components/navigation/header/Header";
import Footer from "@/components/navigation/footer/Footer";

export const revalidate = 3600;

const pollerOne = Poller_One({
  subsets: ["latin"],
  variable: "--font-pollerOne",
  weight: "400",
  preload: true,
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-nunito",
  preload: true,
});

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
  const isDev = process.env.NODE_ENV === "development";
  const messages = await getMessages();
  const [
    { data: nav },
    { data: brandAssets },
    { data: soMe },
    { data: supportedLanguages },
  ] = await Promise.all([
    sanityFetch({ query: NAV_QUERY, params: { language: language } }),
    sanityFetch({ query: BRAND_ASSETS_QUERY, params: {} }),
    sanityFetch({ query: SOMEPROFILES_QUERY, params: {} }),
    sanityFetch({ query: SUPPORTED_LANGUAGES_QUERY, params: {} }),
  ]);

  return (
    <html lang={language}>
      <body className={`${nunito.variable} ${pollerOne.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <SkipToMain language={language} />
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
          <SanityLive />
        </NextIntlClientProvider>
        {isDev && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
