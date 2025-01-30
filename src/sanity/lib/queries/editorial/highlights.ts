import { groq } from "next-sanity";

export const HIGHLIGHTS_PAGE_QUERY = groq`
*[_type == "highlights" && slug[_key == $language][0].value == $slug][0]{
    ...,
  "title": title[_key == $language][0].value,
  "richText": richText[_key == $language][0].value,
    "eventsSection": {
      "title": eventsSection.title[_key == $language][0].value,
  "richText": eventsSection.richText[_key == $language][0].value,
    },
    "availablePositionsSection":
    {
    "title": availablePositionsSection.title[_key == $language][0].value,
  "richText": availablePositionsSection.richText[_key == $language][0].value,
    }, 
}
`;
