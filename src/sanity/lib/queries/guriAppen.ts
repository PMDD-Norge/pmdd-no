/**
 * GROQ query for the guriAppen singleton document
 */

const IMAGE_FIELDS = `
  asset->,
  altText,
  hotspot,
  title,
  description
`;

export const GURI_APPEN_QUERY = `
*[_type == "guriAppen"][0] {
  _id,
  _type,
  _updatedAt,
  title,
  ingress,
  "heroImage": heroImage{${IMAGE_FIELDS}},
  googlePlayUrl,
  appStoreUrl,
  about,
  argumentsTitle,
  arguments[]{
    _key,
    title,
    text,
    "image": image{${IMAGE_FIELDS}}
  },
  footerSection{
    title,
    "image": image{${IMAGE_FIELDS}},
    googlePlayUrl,
    appStoreUrl,
    "screenshots": screenshots[]{${IMAGE_FIELDS}}
  }
}
`;
