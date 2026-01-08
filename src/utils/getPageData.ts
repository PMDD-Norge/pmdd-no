import { sanityFetch } from "@/sanity/lib/live";
import {
  PAGINATED_ARTICLES_QUERY,
  COUNT_ARTICLES_QUERY,
  COLLECTION_CATEGORIES_QUERY,
  ALL_EVENTS_QUERY,
} from "@/sanity/lib/queries";
import { logError } from './logger';

// Type definition for query parameters (next-intl removed)
type QueryParams = Record<string, string | string[] | number | boolean | null | undefined>;

export const cachedSanityFetch = async (
  query: string,
  params: QueryParams | Promise<QueryParams>
) => {
  const response = await sanityFetch({
    query,
    params,
  });

  return response;
};

export const fetchInformationData = async (
  slug: string,
  page: number,
  category?: string
) => {
  const POSTS_PER_PAGE = 12;
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE - 1;

  try {
    const [postsCount, posts, categories] = await Promise.all([
      cachedSanityFetch(COUNT_ARTICLES_QUERY, {
        type: "blog-post",
        category: category || undefined,
      }),
      cachedSanityFetch(PAGINATED_ARTICLES_QUERY, {
        type: "blog-post",
        category: category || undefined,
        start,
        end,
      }),
      cachedSanityFetch(COLLECTION_CATEGORIES_QUERY, {
        articleType: "blog-post",
      }),
    ]);

    if (!posts?.data || !postsCount?.data) return null;

    return {
      posts: posts.data,
      categories: categories.data,
      postsCount: postsCount.data,
    };
  } catch (error) {
    logError(error, { context: "Fetching information data", slug, page, category });
    return null;
  }
};

export const fetchHighlightsData = async () => {
  const [events, positions] = await Promise.all([
    cachedSanityFetch(ALL_EVENTS_QUERY, {}),
    cachedSanityFetch(PAGINATED_ARTICLES_QUERY, {
      type: "job-position",
      category: null,
      start: 0,
      end: 10,
    }),
  ]);

  return { events: events.data, positions: positions.data };
};
