import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import { urlFor } from "@/sanity/lib/image";
import { Section } from "@/sanity/lib/interfaces/pages";
import { sanityFetch } from "@/sanity/lib/live";
import { LANDING_PAGE_QUERY } from "@/sanity/lib/queries/pages";
import { SEO_LANDING_QUERY } from "@/sanity/lib/queries/seo";
import SectionRenderer from "@/utils/renderSection";
import { Metadata } from "next";
export const revalidate = 60; // 1 minute cache

export async function generateMetadata({
  params,
}: {
  params: Promise<{ language: string }>;
}): Promise<Metadata> {
  const { language } = await params;

  const [{ data: seo }] = await Promise.all([
    sanityFetch({
      query: SEO_LANDING_QUERY,
      params: {
        language,
      },
    }),
  ]);

  // Generate favicon URL if available
  const favicon = seo?.favicon;
  const faviconUrl = favicon ? urlFor(favicon).url() : "";

  // Filter out null icons
  const icons = [faviconUrl ? { rel: "icon", url: faviconUrl } : null].filter(
    (icon): icon is NonNullable<typeof icon> => icon !== null
  );

  const metadata = {
    title: seo?.title || "",
    description: seo?.description || "",
    keywords: seo?.keywords || "",
    openGraph: {
      images: [seo?.image || ""],
    },
    icons: { icon: icons },
  };

  return metadata;
}

export default async function Page({
  params,
}: {
  params: Promise<{ language: string }>;
}) {
  try {
    const { language } = await params;

    const {
      data: { landingId, pageData: initialLandingPage },
    } = await sanityFetch({
      query: LANDING_PAGE_QUERY,
      params: { language },
    });
    

    if (!initialLandingPage?.sections) {
      return <PMDDErrorMessage />;
    }

    return (
      <div>
        {initialLandingPage.sections.map((section: Section) => (
          <SectionRenderer key={section._key} section={section} isLandingPage language={language} />
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error loading landing page:', error);
    console.error('Environment:', process.env.NODE_ENV);
    console.error('Has Sanity token:', !!process.env.SANITY_API_TOKEN_PROD);
    console.error('Has dataset:', !!process.env.NEXT_PUBLIC_SANITY_DATASET);
    console.error('Has project ID:', !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
    return <PMDDErrorMessage />;
  }
}
