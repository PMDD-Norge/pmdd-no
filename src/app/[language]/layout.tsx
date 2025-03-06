import "./global.css";
import { Nunito, Poller_One } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import SkipToMain from "@/components/skipToMain/SkipToMain";
import { getLayoutData } from "@/utils/getLayoutData";
import Analytics from "@/components/Analytics";
import { Header } from "@/components/navigation/header/Header";
import Footer from "@/components/navigation/footer/Footer";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

export const revalidate = 3600;

const pollerOne = Poller_One({
  subsets: ["latin"],
  variable: "--font-pollerOne",
  weight: "400",
  display: "swap",
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-nunito",
  display: "swap",
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
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
  const [
    messages,
    [
      { data: nav },
      { data: brandAssets },
      { data: soMe },
      { data: supportedLanguages },
    ],
  ] = await Promise.all([getMessages(), getLayoutData(language)]);

  if (!messages) {
    notFound();
  }

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
        </NextIntlClientProvider>
        {!isDev && <Analytics />}
      </body>
    </html>
  );
}
