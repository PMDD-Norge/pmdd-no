import { Metadata } from "next";
import { SEO_FALLBACK_QUERY, BRAND_ASSETS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { cachedSanityFetch } from "./getPageData";

interface PageProps {
  params: Promise<{
    language: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { language, slug } = await params;
  const lastSlug = slug[slug.length - 1];

  try {
    // Fetch page-specific SEO or use fallback
    const pageQuery = `*[slug.current == $slug][0]{ seo }`;
    const { data: page } = await cachedSanityFetch(pageQuery, {
      slug: lastSlug,
    });

    // Fetch fallback SEO and brand assets
    const [{ data: fallbackSeo }, { data: brandAssets }] = await Promise.all([
      cachedSanityFetch(SEO_FALLBACK_QUERY, {}),
      cachedSanityFetch(BRAND_ASSETS_QUERY, {}),
    ]);

    const seo = page?.seo || fallbackSeo;
    const faviconUrl = brandAssets?.favicon ? urlFor(brandAssets.favicon).url() : "";

    return {
      title: seo?.title || "",
      description: seo?.description || "",
      openGraph: {
        images: seo?.image ? [urlFor(seo.image).url()] : [],
      },
      icons: faviconUrl
        ? { icon: [{ rel: "icon", url: faviconUrl }] }
        : undefined,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {};
  }
}
