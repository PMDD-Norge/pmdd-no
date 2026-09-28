/**
 * GROQ-spørringer for informasjonsseksjonen.
 *
 * Informasjonssiden er et eget dokument (informasjonsdokument), ikke en
 * samlingshub. Artiklene under den er av typen informasjonsartikkel og hentes
 * via de delte artikkelspørringene med $type "blog-post".
 */
import { IMAGE_FRAGMENT } from "./fragments";

export const INFORMASJONSDOKUMENT_QUERY = `
*[_type == "informasjonsdokument"][0] {
  _id,
  _type,
  _updatedAt,
  title,
  slug,
  richText,
  allPostsLabel,
  infoMessage{
    tittel,
    tekst
  },
  "heroImage": heroImage${IMAGE_FRAGMENT},
  contactSection,
  seo{
    title,
    description,
    image{asset->},
    noIndex
  }
}
`;
