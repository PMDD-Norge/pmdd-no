import { groq } from "next-sanity";
import { IMAGE_FRAGMENT } from "../fragments";

const POST_FRAGMENT = groq`
  ...,
  "title": title[_key == $language][0].value,
  "lead": lead[_key == $language][0].value,
  "slug": slug[_key == $language][0].value,
  "richText": richText[_key == $language][0].value,
  "categories": categories[]->{
    ...,
    "name": name[_key == $language][0].value
  },
  "author": author->{
    ...,
    ${IMAGE_FRAGMENT},
    "occupation": occupation[_key == $language][0].value,
  },
  ${IMAGE_FRAGMENT}
`;

export const COUNT_POSTS_QUERY = groq`
  count(*[
    _type == "post" && 
    (
      defined($categoryName) == false ||
      count(categories[_ref in *[
        _type == "category" &&
        name[_key == $language][0].value == $categoryName
      ]._id]) > 0
    )
  ])
`;

export const CATEGORIZED_POSTS_QUERY = groq`
  *[
    _type == "post" &&
 (
      defined($categoryName) == false ||
      count(categories[_ref in *[
        _type == "category" &&
        name[_key == $language][0].value == $categoryName
      ]._id]) > 0
    )
  ] | order(date desc)[$start..$end]{
    ${POST_FRAGMENT}
  }
`;

export const POST_SLUG_QUERY = groq`
  *[_type == "post" && slug[_key == $language][0].value == $slug][0]{
    ${POST_FRAGMENT}
  }
`;

export const MORE_POST_PREVIEW = groq`
  *[_type == "post"] | order(_createdAt desc)[0..2]{
      "title": title[_key == $language][0].value,
  }
`;
