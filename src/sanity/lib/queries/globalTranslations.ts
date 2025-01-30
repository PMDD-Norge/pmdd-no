import { groq } from "next-sanity";

export const GLOBAL_TRANSLATIONS_QUERY = groq`
  *[_type == "globalTranslations"][0] {
    "labels": labels[] {
      "labelKey": labelKey,
      "value": text[_key == $language][0].value
    }
  }.labels
  [defined(value)] 
`;
