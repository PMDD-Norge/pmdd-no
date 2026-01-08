/**
 * Metadata Generation Utilities
 * Centralizes metadata generation to avoid duplication across page files
 */

import { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { SEO_FALLBACK_QUERY, BRAND_ASSETS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

/**
 * SEO data structure from Sanity
 */
interface SanityImageRef {
  asset: {
    _ref: string;
  };
}

interface SEOData {
  title?: string;
  description?: string;
  image?: SanityImageRef;
  noIndex?: boolean;
}

interface BrandAssets {
  favicon?: SanityImageRef;
}

/**
 * Fetches SEO data for a specific slug or uses fallback
 * @param slug - The page slug to fetch SEO data for
 * @returns SEO data and brand assets
 */
export async function fetchSEOData(slug?: string): Promise<{
  seo: SEOData | null;
  brandAssets: BrandAssets | null;
}> {
  // Build query based on whether slug is provided
  const pageQuery = slug
    ? `*[slug.current == $slug][0]{ seo }`
    : null;

  const queries = [
    sanityFetch({
      query: SEO_FALLBACK_QUERY,
      params: {},
    }),
    sanityFetch({
      query: BRAND_ASSETS_QUERY,
      params: {},
    }),
  ];

  // Add page-specific query if slug is provided
  if (pageQuery && slug) {
    queries.unshift(
      sanityFetch({
        query: pageQuery,
        params: { slug },
      })
    );
  }

  const results = await Promise.all(queries);

  let pageData = null;
  let fallbackSeo = null;
  let brandAssets = null;

  if (slug && pageQuery) {
    // If we have a slug, first result is page data
    pageData = results[0].data;
    fallbackSeo = results[1].data;
    brandAssets = results[2].data;
  } else {
    // No slug, only fallback and brand assets
    fallbackSeo = results[0].data;
    brandAssets = results[1].data;
  }

  const seo = pageData?.seo || fallbackSeo;

  return { seo, brandAssets };
}

/**
 * Generates metadata for Next.js pages
 * @param slug - Optional slug for page-specific metadata
 * @returns Next.js Metadata object
 */
export async function generatePageMetadata(slug?: string): Promise<Metadata> {
  const { seo, brandAssets } = await fetchSEOData(slug);

  // Generate favicon URL
  const favicon = brandAssets?.favicon;
  const faviconUrl = favicon ? urlFor(favicon).url() : "";

  // Filter out null icons
  const icons = [faviconUrl ? { rel: "icon" as const, url: faviconUrl } : null].filter(
    (icon): icon is NonNullable<typeof icon> => icon !== null
  );

  // Build metadata object
  const metadata: Metadata = {
    title: seo?.title || "",
    description: seo?.description || "",
    openGraph: {
      images: seo?.image ? [urlFor(seo.image).url()] : [],
    },
    icons: icons.length > 0 ? { icon: icons } : undefined,
  };

  // Add noIndex if specified
  if (seo?.noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}

/**
 * Helper to get the last segment of a slug array
 * @param slug - Array of slug segments
 * @returns Last slug segment
 */
export function getLastSlug(slug: string[]): string {
  return slug[slug.length - 1];
}
