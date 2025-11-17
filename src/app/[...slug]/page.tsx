import { ReactElement } from "react";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import {
  PAGINATED_ARTICLES_QUERY,
  COUNT_ARTICLES_QUERY,
  COLLECTION_CATEGORIES_QUERY,
  ALL_EVENTS_QUERY,
  PAGE_BY_SLUG_QUERY,
  ARTICLE_BY_SLUG_QUERY,
  LANDING_PAGE_ID_QUERY,
  SEO_FALLBACK_QUERY,
  BRAND_ASSETS_QUERY,
} from "@/sanity/lib/queries";
import {
  getDocumentBySlug,
  getDocumentWithLandingCheck,
  getDocumentTypeBySlug,
  QueryType,
} from "@/utils/queries";
import {
  Section,
} from "@/sanity/lib/interfaces/pages";
import SectionRenderer from "@/utils/renderSection";
import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import { Metadata } from "next";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 86400; // ISR: 24 hours - regenerate daily
export const dynamicParams = true; // Enable ISR for new pages

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{
    type?: string;
    page?: string;
    category?: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lastSlug = slug[slug.length - 1];

  // Fetch page-specific SEO or use fallback
  const pageQuery = `*[slug.current == $slug][0]{ seo }`;
  const [{ data: page }, { data: fallbackSeo }, { data: brandAssets }] =
    await Promise.all([
      sanityFetch({
        query: pageQuery,
        params: { slug: lastSlug },
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

export default async function DynamicPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  if (!slug?.length) {
    return <PMDDErrorMessage />;
  }

  // Get document type
  const { data: docType } = await getDocumentTypeBySlug(slug, "no");

  if (!docType) {
    return <PMDDErrorMessage />;
  }

  // Handle different document types
  if (docType === "page") {
    const result = await getDocumentWithLandingCheck(
      QueryType.Page,
      slug,
      "no"
    );
    const document = result.data;
    const landingPageId = result.landingPageId;

    if (!document) {
      return <PMDDErrorMessage />;
    }

    return (
      <>
        {document?.sections?.map((section: Section) => (
          <SectionRenderer
            key={section._key}
            section={section}
            isLandingPage={document._id === landingPageId}
          />
        ))}
      </>
    );
  }

  if (docType === "article") {
    const { data: article } = await getDocumentBySlug(
      QueryType.Article,
      slug,
      "no"
    );

    if (!article) {
      return <PMDDErrorMessage />;
    }

    // TODO: Render article page
    // For now, return a simple placeholder
    return (
      <div>
        <h1>{article.title}</h1>
        <p>Article rendering to be implemented</p>
      </div>
    );
  }

  if (docType === "collectionHub") {
    const { data: hub } = await getDocumentBySlug(
      QueryType.CollectionHub,
      slug,
      "no"
    );

    if (!hub) {
      return <PMDDErrorMessage />;
    }

    // TODO: Render collection hub page
    return (
      <div>
        <h1>{hub.title}</h1>
        <p>Collection hub rendering to be implemented</p>
      </div>
    );
  }

  if (docType === "event") {
    const { data: event } = await getDocumentBySlug(
      QueryType.Event,
      slug,
      "no"
    );

    if (!event) {
      return <PMDDErrorMessage />;
    }

    // TODO: Render event page
    return (
      <div>
        <h1>{event.title}</h1>
        <p>Event rendering to be implemented</p>
      </div>
    );
  }

  return <PMDDErrorMessage />;
}
