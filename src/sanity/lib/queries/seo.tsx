import { groq } from "next-sanity";

export const DOCUMENT_TYPE_QUERY = groq`
  *[slug[_key == $language][0].value == $slug][0]{
    _type
  }
`;

const SEO_FRAGMENT = groq`
    "title": seo.title[_key == $language][0].value,
    "description": seo.description[_key == $language][0].value,
    "keywords": seo.keywords[_key == $language][0].value,
    "imageUrl": seo.image.asset->url
    
    `;

export const SEO_PAGE_ID_QUERY = groq`
  *[_type == "page" && _id == $id][0]{
      ${SEO_FRAGMENT}
}`;

export const SEO_SLUG_QUERY = groq`
  *[_type == "page" && slug[_key == $language][0].value == $slug][0]{
      ${SEO_FRAGMENT}
}`;

export const SEO_INFORMATION_QUERY = groq`
  *[_type == "information"][0]{
      ${SEO_FRAGMENT}
}
`;

export const SEO_HIGHLIGHTS_QUERY = groq`
  *[_type == "highlights"][0]{
      ${SEO_FRAGMENT}
}
`;

/// POSTS DO NOT HAVE A UNIQUE SEO OBJECT BUT IS GENERATED BASED ON CONTENT
export const SEO_POST_ID_SLUG_QUERY = groq`
  *[_type == "post" && slug[_key == $language][0].value == $id][0]{
    "title": title[_key == $language][0].value,
    "description": lead[_key == $language][0].value,
    "imageUrl": image.asset->url
}
`;

export const SEO_FALLBACK_QUERY = groq`
  *[_type == "seoFallback"][0]{
      "title": title[_key == $language][0].value,
      "description": description[_key == $language][0].value,
      "imageUrl": image.asset->url,
      "keywords": keywords[_key == $language][0].value,
      }
`;
