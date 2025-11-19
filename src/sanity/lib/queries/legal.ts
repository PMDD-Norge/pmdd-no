/**
 * GROQ queries for legalDocument documents
 */

// Get legal document by slug
export const LEGAL_DOCUMENT_BY_SLUG_QUERY = `
*[_type == "legalDocument" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  slug,
  richText,
  seo{
    metaTitle,
    metaDescription,
    openGraphImage{asset->},
    noIndex
  }
}
`;

// Get all legal document slugs (for static generation)
export const LEGAL_DOCUMENT_SLUGS_QUERY = `
*[_type == "legalDocument" && defined(slug.current)] {
  "slug": slug.current
}
`;
