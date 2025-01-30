import { groq } from "next-sanity";
import { IMAGE_FRAGMENT, LINK_FRAGMENT } from "../fragments";

export const EVENT_QUERY = groq`
*[_type == "event"] {
    ...,
    "title": title[_key == $language][0].value,
    "richText": richText[_key == $language][0].value,
    link {
    ...,
    ${LINK_FRAGMENT}
    },
    ${IMAGE_FRAGMENT},
}
`;
