// sanityQueriesForMiddleware.ts
export const getSingleSlugQuery = `*[_type in $types && 
  slug[_key == $currentLang][0].value == $currentSlug]{
    "translatedSlug": slug[_key == $newLang][0].value
  }[0]`;

export const getNestedSlugQuery = `*[_type in $types && 
  slug[_key == $currentLang][0].value == $mainSlug]{
    "mainTranslatedSlug": slug[_key == $newLang][0].value,
    "postTranslatedSlug": *[
      _type in ["post"] && 
      slug[_key == $currentLang][0].value == $postSlug
    ]{
      "translatedSlug": slug[_key == $newLang][0].value
    }[0]
  }[0]`;
