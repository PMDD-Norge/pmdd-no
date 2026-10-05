/**
 * GROQ queries for nettbutikk document
 */

import { SEO_FRAGMENT } from "./fragments";

export const NETTBUTIKK_BY_SLUG_QUERY = `
*[_type == "nettbutikk" && slug.current == $slug][0] {
  _id,
  _type,
  pageName,
  slug,
  title,
  richText,
  seo${SEO_FRAGMENT}
}
`;

export const NETTBUTIKK_SLUGS_QUERY = `
*[_type == "nettbutikk" && defined(slug.current)] {
  "slug": slug.current
}
`;
