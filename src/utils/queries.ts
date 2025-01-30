import { sanityFetch } from "@/sanity/lib/live";
import { AVAILABLE_POSITION_SLUG_QUERY } from "@/sanity/lib/queries/editorial/availablePositions";
import { POST_SLUG_QUERY } from "@/sanity/lib/queries/editorial/blogpost";
import { HIGHLIGHTS_PAGE_QUERY } from "@/sanity/lib/queries/editorial/highlights";
import { INFORMATION_PAGE_QUERY } from "@/sanity/lib/queries/editorial/information";
import { LEGAL_DOCUMENT_SLUG_QUERY } from "@/sanity/lib/queries/legalDocuments";
import { SLUG_QUERY } from "@/sanity/lib/queries/pages";

// Using const enum with explicit string values
export const enum QueryType {
  Page = "page",
  LegalDocument = "legalDocument",
  AvailablePosition = "availablePosition",
  Post = "post",
  Highlights = "highlights",
  Information = "information",
}

// Map query types to their respective queries
const Queries: Record<QueryType, string> = {
  [QueryType.Page]: SLUG_QUERY,
  [QueryType.LegalDocument]: LEGAL_DOCUMENT_SLUG_QUERY,
  [QueryType.AvailablePosition]: AVAILABLE_POSITION_SLUG_QUERY,
  [QueryType.Post]: POST_SLUG_QUERY,
  [QueryType.Highlights]: HIGHLIGHTS_PAGE_QUERY,
  [QueryType.Information]: INFORMATION_PAGE_QUERY,
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
  console.log(slugToUse);
  // If we don't have a query for this type, return null
  if (!Queries[type]) {
    return { data: null };
  }

  return sanityFetch({
    query: Queries[type],
    params: { slug: slugToUse, language },
  });
}
