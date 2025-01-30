import { groq } from "next-sanity";

//Languages
export const DEBUG_QUERY = groq`{
  "published": *[_type == "languageSettings" && !(_id in path("drafts.*"))],
  "drafts": *[_type == "languageSettings" && _id in path("drafts.*")]
}`;

export const DEFAULT_LANGUAGE_QUERY = groq`coalesce(
  // Try published first
  *[_type == "languageSettings" && !(_id in path("drafts.*"))][0].languages[default == true][0],
  // Then try draft
  *[_type == "languageSettings" && _id in path("drafts.*")][0].languages[default == true][0]
)`;

export const SUPPORTED_LANGUAGES_QUERY = groq`coalesce(
  *[_type == "languageSettings" && !(_id in path("drafts.*"))][0].languages[],
  *[_type == "languageSettings" && _id in path("drafts.*")][0].languages[]
)`;

// Slug pages
export const SLUG_TRANSLATIONS_FROM_LANGUAGE_QUERY = groq`
  *[slug.current == $slug && language == $language][0]{
    "_translations": *[
      _type == "translation.metadata" 
      && references(^._id)
  ].translations[].value->{
      language,
      "slug": slug.current,
    },
  }
`;

export const SLUG_TRANSLATIONS_TO_LANGUAGE_QUERY = groq`
  *[slug.current == $slug][0]{
    "_translations": (
      *[
        _type == "translation.metadata" 
        && references(^._id)
      ].translations[].value->{
        language,
        "slug": slug.current,
      }
    )[language == $language],
  }
`;
