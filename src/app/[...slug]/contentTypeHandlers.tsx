/**
 * Content Type Handlers
 * Centralizes the logic for handling different document types in the dynamic page router
 * Reduces duplication and makes the page.tsx file more maintainable
 */

import { PAGINATION } from "@/constants";
import { sanityFetch } from "@/sanity/lib/live";
import {
  PAGINATED_ARTICLES_QUERY,
  COUNT_ARTICLES_QUERY,
  COLLECTION_CATEGORIES_QUERY,
  ALL_EVENTS_QUERY,
} from "@/sanity/lib/queries";
import {
  getDocumentBySlug,
  getDocumentWithLandingCheck,
  QueryType,
} from "@/utils/queries";
import {
  Section,
  Category,
  EventDocument,
  AvailablePositionDocument,
  GridItem,
} from "@/sanity/lib/interfaces/pages";
import SectionRenderer from "@/utils/renderSection";
import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import { Information } from "@/components/pages/information/Information";
import { Highlights } from "@/components/pages/highlights/Highlights";
import EventPage from "@/components/pages/event/EventPage";
import ArticlePage from "@/components/pages/article/ArticlePage";
import AvailablePositionPage from "@/components/pages/availablePosition/AvailablePositionPage";
import { ReactElement } from "react";

/**
 * Shared interface for search params
 */
export interface SearchParams {
  type?: string;
  page?: string;
  category?: string;
}

/**
 * Helper: Calculate pagination offsets
 */
function getPaginationOffsets(page: number, postsPerPage: number = PAGINATION.POSTS_PER_PAGE) {
  const start = (page - 1) * postsPerPage;
  const end = start + postsPerPage;
  return { start, end };
}

/**
 * Helper: Fetch articles with categories and count
 */
async function fetchArticlesWithCategories(
  articleType: string,
  page: number,
  category?: string
) {
  const { start, end } = getPaginationOffsets(page);

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

  return { categories, articles, postCount };
}

/**
 * Helper: Fetch events and positions
 */
async function fetchEventsAndPositions() {
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
        end: PAGINATION.MAX_JOB_POSITIONS,
        category: null,
      },
    }),
  ]);

  return { events, positions };
}

/**
 * Handler for "page" document type
 */
export async function handlePageType(
  slug: string[],
  language: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _searchParams?: SearchParams
): Promise<ReactElement> {
  const result = await getDocumentWithLandingCheck(
    QueryType.Page,
    slug,
    language
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

/**
 * Handler for "article" document type
 */
export async function handleArticleType(
  slug: string[],
  language: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _searchParams?: SearchParams
): Promise<ReactElement> {
  const { data: article } = await getDocumentBySlug(
    QueryType.Article,
    slug,
    language
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

/**
 * Handler for "collectionHub" document type
 * Now uses dynamic contentTypes array for flexible content rendering
 */
export async function handleCollectionHubType(
  slug: string[],
  language: string,
  searchParams: SearchParams
): Promise<ReactElement> {
  const result = await getDocumentWithLandingCheck(
    QueryType.CollectionHub,
    slug,
    language
  );
  const hub = result.data;

  if (!hub) {
    return <PMDDErrorMessage />;
  }

  // Check if hub uses new contentTypes structure
  if (hub.contentTypes && hub.contentTypes.length > 0) {
    // New dynamic structure
    const HubHeader = (await import("@/components/hub/HubHeader")).default;
    const ContentSection = (await import("@/components/hub/ContentSection")).default;
    const Contact = (await import("@/components/sections/contact/Contact")).default;

    return (
      <>
        <HubHeader
          title={hub.title}
          description={hub.body || hub.richText}
          image={hub.image}
        />

        {hub.contentTypes.map((section: {
          _key: string;
          sectionTitle?: string;
          description?: string;
          items?: Array<EventDocument | AvailablePositionDocument | GridItem>;
          type: string;
          showFilters?: boolean;
          categories?: Category[];
          layout?: string;
          maxItems?: number;
        }) => {
          // Limit items based on maxItems field
          const limitedItems = section.maxItems
            ? (section.items || []).slice(0, section.maxItems)
            : (section.items || []);

          return (
            <ContentSection
              key={section._key}
              title={section.sectionTitle}
              description={section.description}
              items={limitedItems}
              type={section.type}
              showFilters={section.showFilters}
              categories={section.categories}
              layout={section.layout}
              slug={slug[slug.length - 1]}
            />
          );
        })}

        {hub.contactSection && (
          <Contact contact={hub.contactSection} />
        )}
      </>
    );
  }

  // Legacy handling for old hub types without contentTypes
  const hubType = hub.type || (hub._type === "information" ? "blog" : hub._type === "highlights" ? "highlights" : "blog");

  switch (hubType) {
    case "blog":
    case "news": {
      const page = parseInt(searchParams.page || "1", 10);
      const category = searchParams.category;
      const articleType = hubType === "blog" ? "blog-post" : "news";

      const { categories, articles, postCount } =
        await fetchArticlesWithCategories(articleType, page, category);

      const selectedCategoryName = category
        ? categories?.find(
            (cat: Category & { slug: { current: string } }) =>
              cat.slug.current === category
          )?.name
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
      const { events, positions } = await fetchEventsAndPositions();

      return (
        <Highlights
          highlights={hub}
          events={events || []}
          availablePositions={positions || []}
        />
      );
    }

    default: {
      return <PMDDErrorMessage />;
    }
  }
}

/**
 * Handler for "event" document type
 */
export async function handleEventType(
  slug: string[],
  language: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _searchParams?: SearchParams
): Promise<ReactElement> {
  const { data: event } = await getDocumentBySlug(
    QueryType.Event,
    slug,
    language
  );

  if (!event) {
    return <PMDDErrorMessage />;
  }

  return <EventPage event={event} currentSlug={slug[slug.length - 1]} />;
}

/**
 * Handler for "availablePosition" document type
 */
export async function handleAvailablePositionType(
  slug: string[],
  language: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _searchParams?: SearchParams
): Promise<ReactElement> {
  const { data: position } = await getDocumentBySlug(
    QueryType.AvailablePosition,
    slug,
    language
  );

  if (!position) {
    return <PMDDErrorMessage />;
  }

  return <AvailablePositionPage document={position} />;
}

/**
 * Handler for "legalDocument" document type
 */
export async function handleLegalDocumentType(
  slug: string[],
  language: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _searchParams?: SearchParams
): Promise<ReactElement> {
  const { data: legalDoc } = await getDocumentBySlug(
    QueryType.LegalDocument,
    slug,
    language
  );

  if (!legalDoc) {
    return <PMDDErrorMessage />;
  }

  return (
    <ArticlePage
      article={legalDoc}
      currentSlug={slug[slug.length - 1]}
      showQuickNavigation={false}
    />
  );
}

/**
 * Content type handler registry
 * Maps document types to their handler functions
 *
 * Note: "information" and "highlights" were removed as they are not separate document types.
 * These are now handled by collectionHub with type field ('blog', 'highlights', etc.)
 */
export const contentTypeHandlers = {
  page: handlePageType,
  article: handleArticleType,
  collectionHub: handleCollectionHubType,
  event: handleEventType,
  availablePosition: handleAvailablePositionType,
  legalDocument: handleLegalDocumentType,
} as const;

/**
 * Type for valid content types
 */
export type ContentType = keyof typeof contentTypeHandlers;
