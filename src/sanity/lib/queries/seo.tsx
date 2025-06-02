import { groq } from "next-sanity";

export const SEO_SLUG_QUERY = groq`
  *[
    defined(seo) && 
    (
      $slug == null || 
      count(slug[_key == $language && value == $slug]) > 0
    )
  ][0] {
    "title": select(
      $slug != null => seo.title[_key == $language][0].value,
      *[_type == "seoFallback"][0].title[_key == $language][0].value
    ),
    "description": select(
      $slug != null => seo.description[_key == $language][0].value,
      *[_type == "seoFallback"][0].description[_key == $language][0].value
    ),
    "keywords": select(
      $slug != null => seo.keywords[_key == $language][0].value,
      *[_type == "seoFallback"][0].keywords[_key == $language][0].value
    ),
    "image": select(
      $slug != null => seo.image.asset->url,
      *[_type == "seoFallback"][0].image.asset->url
    ),
    "favicon": *[_type == "brandAssets"][0].favicon.asset->url,
    "companyName": *[_type == "companyInfo"][0].name
  }
`;

export const SEO_LANDING_QUERY = groq`
  *[_type == "page" && _id == *[_type == "navigationManager"][0].setLanding._ref][0] {
    "title": seo.title[_key == $language][0].value,
    "description": seo.description[_key == $language][0].value,
    "keywords": seo.keywords[_key == $language][0].value,
    "image": seo.image.asset->url,
    "favicon": *[_type == "brandAssets"][0].favicon.asset->url,
    "companyName": *[_type == "companyInfo"][0].name
  }
`;
