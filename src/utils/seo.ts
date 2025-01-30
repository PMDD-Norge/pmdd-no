import { Metadata } from "next";
import { toPlainText } from "@portabletext/toolkit";
import { PortableTextBlock } from "sanity";
import { urlFor } from "@/sanity/lib/image";
import { CompanyInfo } from "@/sanity/lib/interfaces/admin";
import { SeoObject } from "@/sanity/lib/interfaces/pages";
import { BrandAssets } from "@/sanity/lib/interfaces/siteSettings";
import { BRAND_ASSETS_QUERY } from "@/sanity/lib/queries/brandAssets";
import { COMPANY_INFO_QUERY } from "@/sanity/lib/queries/companyInformation";
import { SEO_FALLBACK_QUERY } from "@/sanity/lib/queries/seo";
import { client } from "@/sanity/lib/client";

export async function fetchSeoData(
  query: string,
  variables?: any
): Promise<SeoObject | null> {
  try {
    const { data } = await client.fetch(query, variables);
    return data;
  } catch (error) {
    console.error("Error loading SEO data:", error);
    return null;
  }
}

export async function fetchPostSeoData(
  query: string,
  variables?: any
): Promise<SeoObject | null> {
  try {
    const { data } = await client.fetch(query, variables);
    if (data && data.description) {
      const plainTextDescription = toPlainText(data.description);

      return {
        title: data.title,
        description: plainTextDescription,
        imageUrl: data.imageUrl,
        keywords: data.keywords,
      };
    }

    return null;
  } catch (error) {
    console.error("Error loading SEO data:", error);
    return null;
  }
}

export async function fetchBrandAssets(): Promise<BrandAssets | null> {
  try {
    const data = await client.fetch(BRAND_ASSETS_QUERY);
    return data;
  } catch (error) {
    console.error("Error loading site settings:", error);
    return null;
  }
}

export async function fetchCompanyInfo(): Promise<CompanyInfo | null> {
  try {
    const data = await client.fetch(COMPANY_INFO_QUERY);
    return data;
  } catch (error) {
    console.error("Error loading site settings:", error);
    return null;
  }
}

export async function generateMetadataFromSeo(
  seo: SeoObject | null,
  language: string
): Promise<Metadata> {
  const brandAssets = await fetchBrandAssets();
  const { data: seoFallback } = await client.fetch(SEO_FALLBACK_QUERY, {
    language,
  });
  const companyInfo = await fetchCompanyInfo();

  const favicon = brandAssets?.favicon;
  const faviconUrl = favicon ? urlFor(favicon).url() : "";

  const icons = [faviconUrl ? { rel: "icon", url: faviconUrl } : null].filter(
    (icon): icon is NonNullable<typeof icon> => icon !== null
  );

  return {
    title: seo?.title || seoFallback?.title || companyInfo?.name || "",
    description: seo?.description || seoFallback?.description || "",
    keywords: seo?.keywords || seoFallback?.keywords || "",
    openGraph: {
      images: [seo?.imageUrl || seoFallback?.imageUrl || ""],
    },
    icons: { icon: icons },
  };
}
