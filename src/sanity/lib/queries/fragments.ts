import { groq } from "next-sanity";

export const LINK_FRAGMENT = groq`
  ...,
  "title": title[_key == $language][0].value,
  _type == "linkWithDescription" => {
    "description": description[_key == $language][0].value,
  },
  type == "internal" => {
    ...,
     "title": title[_key == $language][0].value,
     "richText": richText[_key == $language][0].value,
     "internalLink": internalLink->{
       _type,
       "_ref": slug[_key == $language][0].value,
 }
}`;

export const IMAGE_FRAGMENT = groq`image {
    ...,
    "title": title[_key == $language][0].value,
    "description": description[_key == $language][0].value,
    "credits": credits[_key == $language][0].value,
    "altText": altText[_key == $language][0].value,
  }`;

export const APPEARANCE_FRAGMENT = groq`
  appearance {
    ...,
    ${IMAGE_FRAGMENT},
  }
`;

export const CTAS_FRAGMENT = groq`
  callToActions[] {
    ...,
    ${LINK_FRAGMENT}
  }
`;

export const LINKS_FRAGMENT = groq`
  links[] {
    ...,
    ${LINK_FRAGMENT}
  }
`;
