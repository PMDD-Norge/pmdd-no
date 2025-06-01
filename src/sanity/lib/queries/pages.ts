import { groq } from "next-sanity";
import {
  APPEARANCE_FRAGMENT,
  CTAS_FRAGMENT,
  IMAGE_FRAGMENT,
  LINK_FRAGMENT,
  LINKS_FRAGMENT,
} from "./fragments";

const SECTIONS_FRAGMENT = groq`
  sections[]{
    ...,
    _type == "hero" => {
      ...,
      "title": title[_key == $language][0].value,
      "body": body[_key == $language][0].value,
      ${IMAGE_FRAGMENT},
      ${CTAS_FRAGMENT},
    },
    _type == "article" => {
      ...,
      "tag": tag[_key == $language][0].value,
      "title": title[_key == $language][0].value,
      "richText": richText[_key == $language][0].value,
      ${APPEARANCE_FRAGMENT},
      ${CTAS_FRAGMENT},
    },
    _type == "grid" => {
      ...,
      "title": title[_key == $language][0].value,
      "richText": richText[_key == $language][0].value,
      lists[] {
        ...,
        "title": title[_key == $language][0].value,
        contentType,
        maxItems,
        ctaLink {
          ...,
          ${LINK_FRAGMENT}
        },
        contentType == "manual" => {
          items[] {
            ...,
            "title": title[_key == $language][0].value,
            "richText": richText[_key == $language][0].value,
            ${IMAGE_FRAGMENT},
            link {
              ...,
              ${LINK_FRAGMENT}
            },
          },
        },
        contentType == "event" => {
          "items": *[_type == "event"] | order(_createdAt desc)[0..5] {
            ...,
            "title": title[_key == $language][0].value,
            "richText": richText[_key == $language][0].value,
            ${IMAGE_FRAGMENT},
            link {
              ...,
              ${LINK_FRAGMENT}
            },
          },
        },
        contentType == "availablePosition" => {
          "items": *[_type == "availablePosition"] | order(_createdAt desc)[0..5] {
            ...,
            "title": title[_key == $language][0].value,
            "lead": lead[_key == $language][0].value,
            "richText": richText[_key == $language][0].value,
            slug,
          },
        },
        contentType == "post" => {
          "items": *[_type == "post"] | order(_createdAt desc)[0..5] {
            ...,
            "title": title[_key == $language][0].value,
            "lead": lead[_key == $language][0].value,
            "richText": richText[_key == $language][0].value,
            ${IMAGE_FRAGMENT},
            slug,
          },
        },
      },
    },
    _type == "features" => {
      ...,
      "title": title[_key == $language][0].value,
      "richText": richText[_key == $language][0].value,
      link {
        ...,
        ${LINK_FRAGMENT}
      },
      ${IMAGE_FRAGMENT},
      list[] {
        ...,
        "title": title[_key == $language][0].value,
        "richText": richText[_key == $language][0].value,
      },
     },
     _type == "testimonials" => {
      ...,
      "title": title[_key == $language][0].value,
      "richText": richText[_key == $language][0].value,
      link {
        ...,
        ${LINK_FRAGMENT}
      },
      list[] {
        ...,
        "richText": richText[_key == $language][0].value,
      }
    },
    _type == "callout" => {
      ...,
      "richText": richText[_key == $language][0].value,
    },
        _type == "quote" => {
      ...,
      "richText": richText[_key == $language][0].value,
    },
    _type == "ctaSection" => {
      ...,
      "title": title[_key == $language][0].value,
      "richText": richText[_key == $language][0].value,
      ${CTAS_FRAGMENT},
      ${APPEARANCE_FRAGMENT},
    },
    _type == "resources" => {
      ...,
      "title": title[_key == $language][0].value,
      "richText": richText[_key == $language][0].value,
      groupedLinks[] {
        "title": optionalTitle[_key == $language][0].value,
        ${LINKS_FRAGMENT},
      }
    },
     _type == "contactSection" => {
      ...,
      "title": title[_key == $language][0].value,
      "richText": richText[_key == $language][0].value,
      ${CTAS_FRAGMENT},
    },
    _type == "imageSection" => {
      "title": title[_key == $language][0].value,
      ${IMAGE_FRAGMENT},
    },
    _type == "logoSalad" => {
      ...,
     ${IMAGE_FRAGMENT},
    },
  }
`;

export const PAGE_QUERY = groq`
  *[_type == "page" && _id == $id][0]{
    ...,
    ${SECTIONS_FRAGMENT}
  }
`;

export const LANDING_PAGE_QUERY = groq`
{
  "landingId": *[_type == "navigationManager"][0].setLanding._ref,
  "pageData": *[_type == "page" && _id == *[_type == "navigationManager"][0].setLanding._ref][0]{
    ...,
    ${SECTIONS_FRAGMENT}
  }
}
`;

export const SLUG_QUERY = groq`
  *[_type == "page" && slug[_key == $language][0].value == $slug][0]{
    ...,
    ${SECTIONS_FRAGMENT}
  }
`;
