import { Metadata } from "next";
import { SEO_SLUG_QUERY } from "@/sanity/lib/queries/seo";
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
    const { data: seo } = await cachedSanityFetch(SEO_SLUG_QUERY, {
      language,
      slug: lastSlug,
    });

    const faviconUrl = seo?.favicon ? urlFor(seo.favicon).url() : "";

    return {
      title: seo?.title || "",
      description: seo?.description || "",
      keywords: seo?.keywords || "",
      openGraph: {
        images: [seo?.image || ""],
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
