import { groq } from "next-sanity";

export const LEGAL_DOCUMENTS_QUERY = groq`
  *[_type == "legalDocument"]{
    ...,
    "title": title[_key == $language][0].value,
    "slug":  slug[_key == $language][0].value,
    "richText": richText[_key == $language][0].value,
  }
`;

export const LEGAL_DOCUMENT_SLUG_QUERY = groq`
  *[_type == "legalDocument" && slug[_key == $language][0].value == $slug][0]{
      ...,
    "title": title[_key == $language][0].value,
    "slug":  slug[_key == $language][0].value,
    "richText": richText[_key == $language][0].value,
  }
`;
