import { groq } from "next-sanity";

const AVAILABLE_POSITION_FRAGMENT = groq`
    ...,
    "tag": tag[_key == $language][0].value,
    "title": title[_key == $language][0].value,
    "lead": lead[_key == $language][0].value,
    "richText": richText[_key == $language][0].value,
    "slug": slug[_key == $language][0].value,
`;

export const AVAILABLE_POSITIONS_QUERY = groq`
    *[_type == "availablePosition"]{
        ${AVAILABLE_POSITION_FRAGMENT}
    }
`;

export const AVAILABLE_POSITION_SLUG_QUERY = groq`
  *[_type == "availablePosition" && slug[_key == $language][0].value == $slug][0]{
    ${AVAILABLE_POSITION_FRAGMENT}
  }
`;
