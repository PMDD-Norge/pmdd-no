/**
 * GROQ queries for aktuelt document
 */

import { LINK_FRAGMENT, SEO_FRAGMENT } from "./fragments";

export const AKTUELT_BY_SLUG_QUERY = `
*[_type == "aktuelt" && slug.current == $slug][0] {
  _id,
  _type,
  pageName,
  slug,
  title,
  ingress,
  alleTyperLabel,
  cta{
    tittel,
    richText,
    lenke${LINK_FRAGMENT}
  },
  seo${SEO_FRAGMENT}
}
`;

export const AKTUELT_SLUGS_QUERY = `
*[_type == "aktuelt" && defined(slug.current)] {
  "slug": slug.current
}
`;
