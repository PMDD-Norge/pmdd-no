import { sanityFetch } from "@/sanity/lib/live";
import {
  CATEGORIZED_POSTS_QUERY,
  COUNT_POSTS_QUERY,
} from "@/sanity/lib/queries/editorial/blogpost";
import { INFORMATION_CATEGORIES_QUERY } from "@/sanity/lib/queries/editorial/information";
import { EVENT_QUERY } from "@/sanity/lib/queries/editorial/event";
import { AVAILABLE_POSITIONS_QUERY } from "@/sanity/lib/queries/editorial/availablePositions";
import { QueryParams } from "next-intl/navigation";

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
  language: string,
  page: number,
  category?: string
) => {
  const POSTS_PER_PAGE = 12;
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE - 1;

  try {
    const [postsCount, posts, categories] = await Promise.all([
      cachedSanityFetch(COUNT_POSTS_QUERY, {
        language,
        categoryName: category || null,
      }),
      cachedSanityFetch(CATEGORIZED_POSTS_QUERY, {
        slug,
        language,
        categoryName: category || null,
        start,
        end,
      }),
      cachedSanityFetch(INFORMATION_CATEGORIES_QUERY, { language }),
    ]);

    if (!posts?.data || !postsCount?.data) return null;

    return {
      posts: posts.data,
      categories: categories.data,
      postsCount: postsCount.data,
    };
  } catch (error) {
    console.error("Error fetching information data:", error);
    return null;
  }
};

export const fetchHighlightsData = async (language: string) => {
  const [events, positions] = await Promise.all([
    cachedSanityFetch(EVENT_QUERY, { language }),
    cachedSanityFetch(AVAILABLE_POSITIONS_QUERY, { language }),
  ]);

  return { events: events.data, positions: positions.data };
};
