import { groq } from "next-sanity";
import { LINK_FRAGMENT } from "./fragments";

export const LANDING_PAGE_ID_QUERY = groq`
  *[_type == "navigationManager"][0].setLanding._ref
`;

export const NAV_QUERY = groq`
  *[_type == "navigationManager"]{
    "main": {
      "links": main[_type == "link"] {
        ...,
        ${LINK_FRAGMENT}
      },
      "ctas": main[_type == "callToActionField"] {
        ...,
        ${LINK_FRAGMENT}
      }
    },
    "sidebar": {
      "links": sidebar[_type == "link"] {
        ...,
        ${LINK_FRAGMENT}
      },
      "ctas": sidebar[_type == "callToActionField"] {
        ...,
        ${LINK_FRAGMENT}
      }
    },
    "footer": footer[] {
      ...,
      sectionType,
      sectionTitle,
      "linksAndContent": linksAndContent[] {
        ...,
        _type == 'richTextObject' => {
          ...,
          "richText": richText[_key == $language][0].value,
        },
        _type == 'link' => {
          ...,
          ${LINK_FRAGMENT}
        }
      },
      "socialMediaLinks": socialMediaLinks->{
        "_ref": slug.current
      }
    }
  }[0]
`;
