import { groq } from "next-sanity";

export const LINK_FRAGMENT = groq`
  _key,
  _type,
  "title": title[_key == $language][0].value,
  type,
  anchor,
  newTab,
  _type == "linkWithDescription" => {
    "description": description[_key == $language][0].value,
  },
  type == "internal" => {
    "internalLink": internalLink->{
       _type,
       "_ref": slug[_key == $language][0].value,
    }
  },
  type == "external" => {
    url
  },
  type == "email" => {
    email
  },
  type == "phone" => {
    phone
  }
`;

export const IMAGE_FRAGMENT = groq`image {
    _key,
    _type,
    asset,
    crop,
    hotspot,
    "title": title[_key == $language][0].value,
    "description": description[_key == $language][0].value,
    "credits": credits[_key == $language][0].value,
    "altText": altText[_key == $language][0].value,
  }`;

export const APPEARANCE_FRAGMENT = groq`
  appearance {
    _key,
    _type,
    theme,
    ${IMAGE_FRAGMENT},
  }
`;

export const CTAS_FRAGMENT = groq`
  callToActions[] {
    ${LINK_FRAGMENT}
  }
`;

export const LINKS_FRAGMENT = groq`
  links[] {
    ${LINK_FRAGMENT}
  }
`;
