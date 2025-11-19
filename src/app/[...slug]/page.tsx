import { sanityFetch } from "@/sanity/lib/live";
import {
  PAGINATED_ARTICLES_QUERY,
  COUNT_ARTICLES_QUERY,
  COLLECTION_CATEGORIES_QUERY,
  ALL_EVENTS_QUERY,
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
  Category,
} from "@/sanity/lib/interfaces/pages";
import SectionRenderer from "@/utils/renderSection";
import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import { Information } from "@/components/pages/information/Information";
import { Highlights } from "@/components/pages/highlights/Highlights";
import EventPage from "@/components/pages/event/EventPage";
import ArticlePage from "@/components/pages/article/ArticlePage";
import AvailablePositionPage from "@/components/pages/availablePosition/AvailablePositionPage";
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

    // Route to different components based on article type
    switch (article.type) {
      case "job-position":
        return <AvailablePositionPage document={article} />;
      case "blog-post":
      case "news":
      default:
        return <ArticlePage article={article} currentSlug={slug[slug.length - 1]} />;
    }
  }

  // Handle information type (renders articles with categories)
  if (docType === "information") {
    const { data: information } = await getDocumentBySlug(
      QueryType.CollectionHub,
      slug,
      "no"
    );

    if (!information) {
      return <PMDDErrorMessage />;
    }

    // Get search params
    const page = parseInt(resolvedSearchParams.page || "1", 10);
    const category = resolvedSearchParams.category;
    const postsPerPage = 12;
    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;

    // Fetch categories, articles, and count in parallel
    const [{ data: categories }, { data: articles }, { data: postCount }] =
      await Promise.all([
        sanityFetch({
          query: COLLECTION_CATEGORIES_QUERY,
          params: { articleType: "news" },
        }),
        sanityFetch({
          query: PAGINATED_ARTICLES_QUERY,
          params: {
            type: "news",
            start,
            end,
            category: category || null,
          },
        }),
        sanityFetch({
          query: COUNT_ARTICLES_QUERY,
          params: {
            type: "news",
            category: category || null,
          },
        }),
      ]);

    const selectedCategoryName = category
      ? categories?.find((cat: Category & { slug: { current: string } }) => cat.slug.current === category)?.name
      : undefined;

    return (
      <Information
        information={information}
        categories={categories || []}
        initialPosts={articles || []}
        slug={slug[slug.length - 1]}
        postCount={postCount || 0}
        currentPage={page}
        selectedCategoryName={selectedCategoryName}
      />
    );
  }

  // Handle highlights type (renders events and positions)
  if (docType === "highlights") {
    const { data: highlights } = await getDocumentBySlug(
      QueryType.CollectionHub,
      slug,
      "no"
    );

    if (!highlights) {
      return <PMDDErrorMessage />;
    }

    // Fetch events and job positions in parallel
    const [{ data: events }, { data: positions }] = await Promise.all([
      sanityFetch({
        query: ALL_EVENTS_QUERY,
        params: {},
      }),
      sanityFetch({
        query: PAGINATED_ARTICLES_QUERY,
        params: {
          type: "job-position",
          start: 0,
          end: 100,
          category: null,
        },
      }),
    ]);

    return (
      <Highlights
        highlights={highlights}
        events={events || []}
        availablePositions={positions || []}
      />
    );
  }

  // Handle collectionHub type
  if (docType === "collectionHub") {
    const result = await getDocumentWithLandingCheck(
      QueryType.CollectionHub,
      slug,
      "no"
    );
    const hub = result.data;
    const landingPageId = result.landingPageId;

    if (!hub) {
      return <PMDDErrorMessage />;
    }

    // Route to specialized components based on hub type
    switch (hub.type) {
      case "blog":
      case "news": {
        // Use Information component for blog and news hubs
        const page = parseInt(resolvedSearchParams.page || "1", 10);
        const category = resolvedSearchParams.category;
        const postsPerPage = 12;
        const start = (page - 1) * postsPerPage;
        const end = start + postsPerPage;
        const articleType = hub.type === "blog" ? "blog-post" : "news";

        const [{ data: categories }, { data: articles }, { data: postCount }] =
          await Promise.all([
            sanityFetch({
              query: COLLECTION_CATEGORIES_QUERY,
              params: { articleType },
            }),
            sanityFetch({
              query: PAGINATED_ARTICLES_QUERY,
              params: {
                type: articleType,
                start,
                end,
                category: category || null,
              },
            }),
            sanityFetch({
              query: COUNT_ARTICLES_QUERY,
              params: {
                type: articleType,
                category: category || null,
              },
            }),
          ]);

        const selectedCategoryName = category
          ? categories?.find((cat: Category & { slug: { current: string } }) => cat.slug.current === category)?.name
          : undefined;

        return (
          <Information
            information={hub}
            categories={categories || []}
            initialPosts={articles || []}
            slug={slug[slug.length - 1]}
            postCount={postCount || 0}
            currentPage={page}
            selectedCategoryName={selectedCategoryName}
          />
        );
      }

      case "highlights": {
        // Use Highlights component for highlights hub
        const [{ data: events }, { data: positions }] = await Promise.all([
          sanityFetch({
            query: ALL_EVENTS_QUERY,
            params: {},
          }),
          sanityFetch({
            query: PAGINATED_ARTICLES_QUERY,
            params: {
              type: "job-position",
              start: 0,
              end: 100,
              category: null,
            },
          }),
        ]);

        return (
          <Highlights
            highlights={hub}
            events={events || []}
            availablePositions={positions || []}
          />
        );
      }

      default: {
        // For other hub types or if page is defined, render page sections
        if (!hub.page) {
          return <PMDDErrorMessage />;
        }

        return (
          <>
            {hub.page.sections?.map((section: Section) => (
              <SectionRenderer
                key={section._key}
                section={section}
                isLandingPage={hub.page._id === landingPageId}
              />
            ))}
          </>
        );
      }
    }
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

    return <EventPage event={event} currentSlug={slug[slug.length - 1]} />;
  }

  if (docType === "availablePosition") {
    const { data: position } = await getDocumentBySlug(
      QueryType.AvailablePosition,
      slug,
      "no"
    );

    if (!position) {
      return <PMDDErrorMessage />;
    }

    return <AvailablePositionPage document={position} />;
  }

  if (docType === "legalDocument") {
    const { data: legalDoc } = await getDocumentBySlug(
      QueryType.LegalDocument,
      slug,
      "no"
    );

    if (!legalDoc) {
      return <PMDDErrorMessage />;
    }

    return <ArticlePage article={legalDoc} currentSlug={slug[slug.length - 1]} showQuickNavigation={false} />;
  }

  return <PMDDErrorMessage />;
}
