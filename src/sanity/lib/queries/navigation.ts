import { groq } from "next-sanity";
import { LINK_FRAGMENT } from "./fragments";

export const NAV_QUERY = groq`
  *[_type == "navigationManager"]{
    "main": main[] {
      ...,
      ${LINK_FRAGMENT}
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
    },
    "sidebar": sidebar[] {
      ...,
      ${LINK_FRAGMENT}
    }
  }[0]
`;
