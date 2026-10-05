/**
 * GROQ queries for engasjerDeg documents
 */

import { IMAGE_FRAGMENT, LINK_FRAGMENT, SEO_FRAGMENT } from "./fragments";

export const ENGASJER_DEG_BY_SLUG_QUERY = `
*[_type == "engasjerDeg" && slug.current == $slug][0] {
  _id,
  _type,
  pageName,
  slug,
  title,
  ingress,
  "heroImage": heroImage${IMAGE_FRAGMENT},
  likepersoner{
    tittel,
    richText,
    lenke${LINK_FRAGMENT}
  },
  turvenner{
    tittel,
    richText,
    lenker[]${LINK_FRAGMENT}
  },
  ledigeVerv{
    tittel,
    richText,
    "callToAction": callToAction{
      _key,
      _type,
      title,
      description,
      type,
      "internalLink": internalLink->{
        _type,
        title,
        slug{
          current
        }
      },
      url,
      email,
      phone,
      anchor,
      newTab
    }
  },
  seo${SEO_FRAGMENT}
}
`;

export const ENGASJER_DEG_SLUGS_QUERY = `
*[_type == "engasjerDeg" && defined(slug.current)] {
  "slug": slug.current
}
`;
