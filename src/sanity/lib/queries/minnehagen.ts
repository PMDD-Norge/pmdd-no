/**
 * GROQ queries for minnehagen documents
 */

import { SLUG_PROJEKSJON } from "./slugs";

export const MINNEHAGEN_BY_SLUG_QUERY = `
*[_type == "minnehagen" && slug.current == $slug][0] {
  _id,
  _type,
  pageName,
  slug,
  title,
  richText,
  "image": heroImage{
    asset->,
    altText,
    hotspot,
    title,
    description
  },
  contactSection{
    _type,
    _key,
    title,
    "richText": coalesce(body, richText),
    callToActions[]{
      _key,
      _type,
      title,
      type,
      "internalLink": internalLink->{
        _type,
        title,
        ${SLUG_PROJEKSJON}
      },
      url,
      email,
      phone,
      anchor,
      newTab
    },
    appearance{
      theme,
      linkType
    }
  },
  vippsDonasjoner{
    aktivert,
    tittel,
    beskrivelse,
    vippsNummer,
    innsamlingslenke,
    forslagteBeloep[]{
      beloep,
      etikett
    },
    takkeTekst
  },
  "callToAction": callToAction{
    title,
    type,
    "internalLink": internalLink->{
      _type,
      title,
      ${SLUG_PROJEKSJON}
    },
    url,
    email,
    phone,
    anchor,
    newTab
  },
  seo{
    title,
    description,
    image{ asset-> },
    noIndex
  }
}
`;

export const MINNEHAGEN_SLUGS_QUERY = `
*[_type == "minnehagen" && defined(slug.current)] {
  "slug": slug.current
}
`;
