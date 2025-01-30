import { groq } from "next-sanity";

export const BRAND_ASSETS_QUERY = groq`
  *[_type == "brandAssets"][0]
`;
