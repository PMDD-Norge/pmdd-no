/**
 * GROQ-spørringer for ressurssiden.
 *
 * Siden bygges av singleton-dokumentet ressursdokument (tekster og verktøy),
 * pluss tre samlinger som hentes automatisk: informasjonsmateriell
 * (nedlastbare filer), retningslinjer og forskningsartikler.
 */

import { IMAGE_SIMPLE_FRAGMENT, SEO_FRAGMENT } from "./fragments";

export const RESSURSER_QUERY = `
{
  "side": *[_type == "ressursdokument"][0] {
    _id,
    title,
    ingress,
    richText,
    verktoy{
      tittel,
      undertittelDrsp,
      richText,
      lenker[]{
        _key,
        tittel,
        url,
        "filUrl": fil.asset->url,
        beskrivelse
      }
    },
    materiellTittel,
    retningslinjerTittel,
    artikkelListe{
      tittel,
      undertittelAapne,
      undertittelLaaste
    },
    cta{
      tittel,
      richText,
      epost
    },
    seo${SEO_FRAGMENT}
  },
  "materiell": *[_type == "informasjonsmateriell"][0].filer[]{
    _key,
    tittel,
    "filUrl": fil.asset->url,
    "coverBilde": coverBilde${IMAGE_SIMPLE_FRAGMENT}
  },
  "retningslinjer": *[_type == "retningslinje" && !(_id in path("drafts.**"))] | order(orderRank) {
    _id,
    title,
    kortBio,
    link
  },
  "forskningsartikler": *[_type == "forskningsartikkel" && !(_id in path("drafts.**"))] | order(title asc) {
    _id,
    title,
    kortBio,
    link,
    laast
  }
}
`;
