/**
 * GROQ queries for minnehagen documents
 */

export const MINNEHAGEN_BY_SLUG_QUERY = `
*[_type == "minnehagen" && slug.current == $slug][0] {
  _id,
  _type,
  pageName,
  slug,
  title,
  richText,
  heroImage{
    asset->,
    altText,
    hotspot,
    title,
    description
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
      slug
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
