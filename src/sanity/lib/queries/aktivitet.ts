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
      gruppe,
      occupation,
      image${IMAGE_SIMPLE_FRAGMENT}
    }
  }
`;

// Kommende aktiviteter (dato i dag eller senere, regnet ut med now() i UTC),
// sortert på dato. Aktiviteter uten dato vises alltid og havner sist.
export const ALL_AKTIVITETER_QUERY = `
*[_type == "aktivitet" && !(_id in path("drafts.**"))
  && (!defined(detaljer.dato) || detaljer.dato >= string::split(string(now()), "T")[0])] | order(coalesce(detaljer.dato, "9999-12-31") asc) {
  ${AKTIVITET_FIELDS}
}
`;
