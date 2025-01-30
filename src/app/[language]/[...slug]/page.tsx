import { ReactElement } from "react";
import { notFound } from "next/navigation";
import {
  CATEGORIZED_POSTS_QUERY,
  COUNT_POSTS_QUERY,
} from "@/sanity/lib/queries/editorial/blogpost";
import { INFORMATION_CATEGORIES_QUERY } from "@/sanity/lib/queries/editorial/information";
import { EVENT_QUERY } from "@/sanity/lib/queries/editorial/event";
import { AVAILABLE_POSITIONS_QUERY } from "@/sanity/lib/queries/editorial/availablePositions";
import { sanityFetch } from "@/sanity/lib/live";
import {
  getDocumentBySlug,
  getDocumentTypeBySlug,
  QueryType,
} from "@/utils/queries";
import PostPage from "@/components/pages/post/PostPage";
import AvailablePositionPage from "@/components/pages/availablePosition/AvailablePositionPage";
import { Information } from "@/components/pages/information/Information";
import { Highlights } from "@/components/pages/highlights/Highlights";
import Legal from "@/components/pages/legal/Legal";
import {
  AvailablePositionDocument,
  HightlightsDocument,
  InformationDocument,
  PageDocument,
  PostDocument,
  Section,
} from "@/sanity/lib/interfaces/pages";
import SectionRenderer from "@/utils/renderSection";
import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import { LegalDocument } from "@/sanity/lib/interfaces/admin";

export const revalidate = 3600;

interface ComponentProps {
  document:
    | PageDocument
    | PostDocument
    | AvailablePositionDocument
    | InformationDocument
    | HightlightsDocument
    | LegalDocument;
  slug?: string[];
  language: string;
  searchParams?: {
    type?: string;
    page?: string;
    category?: string;
  };
}

// Separate data fetching functions for better organization
const fetchInformationData = async (
  slug: string,
  language: string,
  page: number,
  category?: string
) => {
  const POSTS_PER_PAGE = 12;
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE - 1;

  const [postsCount, posts, categories] = await Promise.all([
    sanityFetch({
      query: COUNT_POSTS_QUERY,
      params: { language, categoryName: category || null },
    }),
    sanityFetch({
      query: CATEGORIZED_POSTS_QUERY,
      params: {
        slug,
        language,
        categoryName: category || null,
        start,
        end,
      },
    }),
    sanityFetch({
      query: INFORMATION_CATEGORIES_QUERY,
      params: { language },
    }),
  ]);

  if (!posts?.data || !postsCount?.data) return null;
  return {
    posts: posts.data,
    categories: categories.data,
    postsCount: postsCount.data,
  };
};

const fetchHighlightsData = async (language: string) => {
  const [events, positions] = await Promise.all([
    sanityFetch({
      query: EVENT_QUERY,
      params: { language },
    }),
    sanityFetch({
      query: AVAILABLE_POSITIONS_QUERY,
      params: { language },
    }),
  ]);

  return { events: events.data, positions: positions.data };
};

// Component mapping with async handlers
const pageComponentMap: Record<
  QueryType,
  (props: ComponentProps) => Promise<ReactElement> | ReactElement
> = {
  [QueryType.Post]: ({ document, language }) => (
    <PostPage post={document as PostDocument} language={language} />
  ),

  [QueryType.AvailablePosition]: ({ document }) => (
    <AvailablePositionPage document={document as AvailablePositionDocument} />
  ),

  [QueryType.Information]: async ({
    document,
    slug,
    language,
    searchParams,
  }) => {
    const page = Number(searchParams?.page) || 1;
    if (!slug) return notFound();
    const data = await fetchInformationData(
      slug[0],
      language,
      page,
      searchParams?.category
    );

    if (!data) return notFound();

    return (
      <Information
        information={document as InformationDocument}
        initialPosts={data.posts}
        slug={slug[0]}
        language={language}
        categories={data.categories}
        selectedCategoryName={searchParams?.category}
        postCount={data.postsCount}
        currentPage={page}
      />
    );
  },

  [QueryType.Highlights]: async ({ document, slug, language }) => {
    if (!slug) return notFound();
    const data = await fetchHighlightsData(language);
    return (
      <Highlights
        highlights={document as HightlightsDocument}
        slug={slug[0]}
        language={language}
        events={data.events}
        availablePositions={data.positions}
      />
    );
  },

  [QueryType.LegalDocument]: ({ document, language }) => (
    <Legal document={document as LegalDocument} language={language} />
  ),

  [QueryType.Page]: ({ document }) => (
    <>
      {(document as PageDocument)?.sections?.map((section: Section) => (
        <SectionRenderer
          key={section._key}
          section={section}
          isLandingPage={false}
        />
      ))}
    </>
  ),
};

export default async function DynamicPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[]; language: string }>;
  searchParams: Promise<{
    type?: string;
    page?: string;
    category?: string;
  }>;
}) {
  const { slug, language } = await params;
  const resolvedSearchParams = await searchParams;

  if (!slug?.length) {
    return <PMDDErrorMessage />;
  }

  const { data: docType } = await getDocumentTypeBySlug(slug, language);

  if (!docType || !(docType in pageComponentMap)) {
    return <PMDDErrorMessage />;
  }

  const { data: document } = await getDocumentBySlug(docType, slug, language);

  if (!document) {
    return <PMDDErrorMessage />;
  }

  const Component = pageComponentMap[docType as QueryType];
  return Component({
    document,
    slug,
    language,
    searchParams: resolvedSearchParams,
  });
}
