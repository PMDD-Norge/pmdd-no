/**
 * GROQ queries for aktivitet documents (erstatter event og walkingTour)
 */

import { IMAGE_SIMPLE_FRAGMENT, LINK_FRAGMENT } from "./fragments";

const AKTIVITET_FIELDS = `
  _id,
  _type,
  type,
  title,
  ingress,
  detaljer{
    dato,
    tid,
    sted,
    pris,
    lenke${LINK_FRAGMENT},
    wheelchairFriendly,
    strollerFriendly,
    bringFood
  },
  involverte{
    tittel,
    "personer": personer[]->{
      _id,
      name,
      city,
      occupation,
      bio,
      image${IMAGE_SIMPLE_FRAGMENT}
    }
  }
`;

// Alle aktiviteter, sortert på dato. Filtrering på utløpt dato gjøres ved
// rendring (se kommendeAktiviteter), siden now() i GROQ blir fryst i
// cachede svar fra Sanity Live.
export const ALL_AKTIVITETER_QUERY = `
*[_type == "aktivitet" && !(_id in path("drafts.**"))] | order(coalesce(detaljer.dato, "9999-12-31") asc) {
  ${AKTIVITET_FIELDS}
}
`;

// Én aktivitet til egen side. Slugen lages fra tittelen på frontend
// (se utils/aktivitetSlug), så siden slås opp på dokument-ID. Utløpte
// aktiviteter vises også her, slik at delte lenker ikke dør.
export const AKTIVITET_BY_ID_QUERY = `
*[_type == "aktivitet" && _id == $id][0] {
  ${AKTIVITET_FIELDS},
  richText
}
`;

// Minimal liste over alle aktiviteter, til å regne ut slugs og sitemap.
export const AKTIVITET_ID_TITLE_QUERY = `
*[_type == "aktivitet" && !(_id in path("drafts.**"))] | order(_id asc) {
  _id,
  title,
  _updatedAt
}
`;
