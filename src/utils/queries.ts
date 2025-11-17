import { sanityFetch } from "@/sanity/lib/live";
import {
  ARTICLE_BY_SLUG_QUERY,
  PAGE_BY_SLUG_QUERY,
  COLLECTION_HUB_BY_TYPE_QUERY,
  LANDING_PAGE_ID_QUERY,
} from "@/sanity/lib/queries";

// Using const enum with explicit string values
export const enum QueryType {
  Page = "page",
  Article = "article",
  CollectionHub = "collectionHub",
  Event = "event",
}

// Map query types to their respective queries
const Queries: Record<QueryType, string> = {
  [QueryType.Page]: PAGE_BY_SLUG_QUERY,
  [QueryType.Article]: ARTICLE_BY_SLUG_QUERY,
  [QueryType.CollectionHub]: COLLECTION_HUB_BY_TYPE_QUERY,
  [QueryType.Event]: `*[_type == "event" && slug.current == $slug][0]`,
};

export async function getDocumentTypeBySlug(slug: string[], language: string) {
  const slugToUse = slug.length > 1 ? slug[slug.length - 1] : slug[0];
  return sanityFetch({
    query: `*[defined(slug) && slug[_key == $language][0].value == $slug][0]._type`,
    params: { slug: slugToUse, language },
  });
}

export async function getDocumentBySlug(
  type: QueryType,
  slug: string[],
  language: string
) {
  // Get the last element of the array if it exists, otherwise use the first element
  const slugToUse = slug.length > 1 ? slug[slug.length - 1] : slug[0];
  // If we don't have a query for this type, return null
  if (!Queries[type]) {
    return { data: null };
  }

  return sanityFetch({
    query: Queries[type],
    params: { slug: slugToUse, language },
  });
}

export async function getDocumentWithLandingCheck(
  type: QueryType,
  slug: string[],
  language: string
) {
  // Get the last element of the array if it exists, otherwise use the first element
  const slugToUse = slug.length > 1 ? slug[slug.length - 1] : slug[0];
  // If we don't have a query for this type, return null
  if (!Queries[type]) {
    return { data: null, landingPageId: null };
  }

  const [documentResult, landingPageResult] = await Promise.all([
    sanityFetch({
      query: Queries[type],
      params: { slug: slugToUse, language },
    }),
    sanityFetch({
      query: LANDING_PAGE_ID_QUERY,
    }),
  ]);

  return { 
    data: documentResult.data, 
    landingPageId: landingPageResult.data 
  };
}
