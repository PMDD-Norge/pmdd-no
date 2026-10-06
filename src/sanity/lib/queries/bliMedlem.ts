/**
 * GROQ queries for bliMedlem documents
 */

import { IMAGE_FRAGMENT, LINK_FRAGMENT, SEO_FRAGMENT } from "./fragments";

export const BLI_MEDLEM_BY_SLUG_QUERY = `
*[_type == "bliMedlem" && slug.current == $slug][0] {
  _id,
  _type,
  pageName,
  slug,
  title,
  ingress,
  "heroImage": heroImage${IMAGE_FRAGMENT},
  betydningAvMedlemskap{
    tittel,
    richText,
    lenke${LINK_FRAGMENT}
  },
  medlemskapstyper{
    tittel,
    richText,
    iframeUrl
  },
  andreMaaterAaBidraPaa{
    tittel,
    richText
  },
  seo${SEO_FRAGMENT}
}
`;

export const BLI_MEDLEM_SLUGS_QUERY = `
*[_type == "bliMedlem" && defined(slug.current)] {
  "slug": slug.current
}
`;
