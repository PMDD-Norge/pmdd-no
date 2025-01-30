import { groq } from "next-sanity";
import { CTAS_FRAGMENT } from "../fragments";

// CATEGORIES
export const INFORMATION_CATEGORIES_QUERY = groq`
  *[
    _type == "category" &&
    count(*[
      _type == "post" && 
      ^._id in categories[]._ref
    ]) > 0
  ]{
    ...,
    "name": name[_key == $language][0].value,
  }
`;

//  information PAGE QUERIES

export const INFORMATION_PAGE_QUERY = groq`
*[_type == "information" && slug[_key == $language][0].value == $slug][0]{
 "allPostsLabel": allPostsLabel[_key == $language][0].value,
  "title": title[_key == $language][0].value,
  "richText": richText[_key == $language][0].value,
  "contactSection": {
        "title": contactSection.title[_key == $language][0].value,
        "richText": contactSection.richText[_key == $language][0].value,
        "callToActions": contactSection.${CTAS_FRAGMENT},
        "appearance": contactSection.appearance,
      },
}
`;
