import { groq } from "next-sanity";

export const REDIRECTS_QUERY = groq`
  *[_type == "redirect" && isActive == true] {
    fromPath,
    toPath,
    redirectType
  }
`;