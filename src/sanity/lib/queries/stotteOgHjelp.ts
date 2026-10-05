/**
 * GROQ queries for stotteOgHjelp documents
 */

import { IMAGE_FRAGMENT, LINK_FRAGMENT, SEO_FRAGMENT } from "./fragments";

export const STOTTE_OG_HJELP_BY_SLUG_QUERY = `
*[_type == "stotteOgHjelp" && slug.current == $slug][0] {
  _id,
  _type,
  pageName,
  slug,
  title,
  ingress,
  "heroImage": heroImage${IMAGE_FRAGMENT},
  fellesskap{
    tittel,
    richText,
    lenker[]${LINK_FRAGMENT}
  },
  likepersoner{
    tittel,
    richText,
    lenke${LINK_FRAGMENT}
  },
  gaaturer{
    tittel,
    richText,
    lenker[]${LINK_FRAGMENT}
  },
  minnehagen{
    tittel,
    richText,
    "bilde": bilde${IMAGE_FRAGMENT},
    lenke${LINK_FRAGMENT}
  },
  seo${SEO_FRAGMENT}
}
`;

export const STOTTE_OG_HJELP_SLUGS_QUERY = `
*[_type == "stotteOgHjelp" && defined(slug.current)] {
  "slug": slug.current
}
`;
