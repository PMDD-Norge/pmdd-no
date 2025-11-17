import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import { urlFor } from "@/sanity/lib/image";
import { Section } from "@/sanity/lib/interfaces/pages";
import { sanityFetch } from "@/sanity/lib/live";
import {
  LANDING_PAGE_QUERY,
  LANDING_PAGE_ID_QUERY,
} from "@/sanity/lib/queries";
import { SEO_FALLBACK_QUERY, BRAND_ASSETS_QUERY } from "@/sanity/lib/queries";
import SectionRenderer from "@/utils/renderSection";
import { Metadata } from "next";
export const revalidate = 43200; // ISR: 12 hours for landing page

export async function generateMetadata(): Promise<Metadata> {
  const [{ data: page }, { data: fallbackSeo }, { data: brandAssets }] =
    await Promise.all([
      sanityFetch({
        query: LANDING_PAGE_QUERY,
        params: {},
      }),
      sanityFetch({
        query: SEO_FALLBACK_QUERY,
        params: {},
      }),
      sanityFetch({
        query: BRAND_ASSETS_QUERY,
        params: {},
      }),
    ]);

  const seo = page?.seo || fallbackSeo;
  const favicon = brandAssets?.favicon;
  const faviconUrl = favicon ? urlFor(favicon).url() : "";

  // Filter out null icons
  const icons = [faviconUrl ? { rel: "icon", url: faviconUrl } : null].filter(
    (icon): icon is NonNullable<typeof icon> => icon !== null
  );

  const metadata = {
    title: seo?.title || "",
    description: seo?.description || "",
    openGraph: {
      images: seo?.image ? [urlFor(seo.image).url()] : [],
    },
    icons: { icon: icons },
  };

  return metadata;
}

export default async function Page() {
  try {
    const { data: initialLandingPage } = await sanityFetch({
      query: LANDING_PAGE_QUERY,
      params: {},
    });

    if (!initialLandingPage?.sections) {
      return <PMDDErrorMessage />;
    }

    return (
      <div>
        {initialLandingPage.sections?.map((section: Section) => (
          <SectionRenderer key={section._key} section={section} isLandingPage />
        ))}
      </div>
    );
  } catch {
    return <PMDDErrorMessage />;
  }
}
