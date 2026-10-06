/**
 * GROQ queries for omForeningen documents
 */

import { IMAGE_FRAGMENT, IMAGE_SIMPLE_FRAGMENT, LINK_FRAGMENT, SEO_FRAGMENT } from "./fragments";

export const OM_FORENINGEN_BY_SLUG_QUERY = `
*[_type == "omForeningen" && slug.current == $slug][0] {
  _id,
  _type,
  pageName,
  slug,
  title,
  ingress,
  richText,
  "heroImage": heroImage${IMAGE_FRAGMENT},
  organisasjonenVaar{
    tittel,
    richText,
    seksjoner[]{
      _key,
      tittel,
      body,
      "folk": folk[]->{
        _id,
        name,
        occupation,
        email,
        image${IMAGE_SIMPLE_FRAGMENT}
      }
    },
    oppfordring{
      tittel,
      richText,
      lenker[]${LINK_FRAGMENT}
    }
  },
  styrendeDokumenter{
    tittel,
    richText,
    "dokumenter": dokumenter[]->{
      _id,
      title,
      slug
    }
  },
  seo${SEO_FRAGMENT}
}
`;

export const OM_FORENINGEN_SLUGS_QUERY = `
*[_type == "omForeningen" && defined(slug.current)] {
  "slug": slug.current
}
`;
